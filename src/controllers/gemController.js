import Gem from "../models/Gem.js"
import { uploadToDrive, deleteFromDrive } from "../utils/googleDriveService.js"

// @desc    Get all gems
// @route   GET /api/gems
// @access  Private
export const getGems = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 10
    const page = Number(req.query.page) || 1

    // Build query
    const query = {}

    // Filter by Gem ID (search)
    if (req.query.gemId) {
      query.gemId = { $regex: req.query.gemId, $options: "i" }
    }

    // Enforce assignee filter for TESTER role
    if (req.user && req.user.role === "TESTER") {
      query.currentAssignee = req.user._id
    }

    // Filter by Status
    if (req.query.status) {
      query.status = req.query.status
    }

    // Filter by Current Assignee (User ID)
    if (req.query.currentAssignee) {
      query.currentAssignee = req.query.currentAssignee
    }

    // Filter by Date Range (createdAt)
    if (req.query.startDate || req.query.endDate) {
      query.createdAt = {}
      if (req.query.startDate) {
        query.createdAt.$gte = new Date(req.query.startDate)
      }
      if (req.query.endDate) {
        // Set end date to end of day if only date is provided, or rely on client sending full timestamp
        // Using $lte for inclusive comparison
        query.createdAt.$lte = new Date(req.query.endDate)
      }
    }

    // Count total documents for pagination
    const count = await Gem.countDocuments(query)

    const gems = await Gem.find(query)
      .populate("currentAssignee", "name role")
      .populate("intake.helperId", "name role")
      .sort({ updatedAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1))

    res.json({
      gems,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    })
  } catch (error) {
    res.status(500).json({ message: "Error fetching gems", error: error.message })
  }
}

// @desc    Get gem by ID
// @route   GET /api/gems/:id
// @access  Private
export const getGemById = async (req, res) => {
  const gem = await Gem.findById(req.params.id)
    .populate("currentAssignee", "name role")
    .populate("intake.helperId", "name role")
    .populate("test1.testerId", "name role")
    .populate("test2.testerId", "name role")
    .populate("finalApproval.approverId", "name role")
  if (gem) {
    res.json(gem)
  } else {
    res.status(404).json({ message: "Gem not found" })
  }
}

// @desc    Create a new gem (Intake)
// @route   POST /api/gems/intake
// @access  Private/Helper
export const intakeGem = async (req, res) => {
  const {
    color,
    emeraldWeight,
    diamondWeight,
    totalArticleWeight,
    shape,
    cut,
    itemDescription,
    testerId1,
    testerId2,
    customerId,
  } = req.body

  // Generate unique gem ID if not provided
  const gemCount = await Gem.countDocuments()
  const gemId = `GEM-${new Date().getFullYear()}-${(gemCount + 1).toString().padStart(3, "0")}`

  let imageUrl = ""
  let googleDriveFileId = ""

  if (req.file) {
    try {
      const uploadResult = await uploadToDrive(req.file)
      imageUrl = uploadResult.link
      googleDriveFileId = uploadResult.id
    } catch (error) {
      console.error("Failed to upload to Google Drive:", error)
      // Continue without image or handle error
    }
  }

  const gem = new Gem({
    gemId,
    status: "READY_FOR_T1",
    color,
    emeraldWeight,
    diamondWeight,
    totalArticleWeight,
    shape,
    cut,
    itemDescription,
    imageUrl,
    googleDriveFileId,
    assignedTester1: testerId1 || null,
    assignedTester2: testerId2 || null,
    currentAssignee: testerId1 || null,
    customerId: customerId || null,
    intake: {
      helperId: req.user._id,
      timestamp: new Date(),
    },
  })

  try {
    const createdGem = await gem.save()
    res.status(201).json(createdGem)
  } catch (error) {
    res.status(500).json({ message: "Error saving gem", error: error.message })
  }
}

// @desc    Update gem basic info or image
// @route   PUT /api/gems/:id
// @access  Private
export const updateGem = async (req, res) => {
  try {
    const gem = await Gem.findById(req.params.id)

    if (gem) {
      // Handle image update
      if (req.file) {
        // Delete old image if it exists on drive
        if (gem.googleDriveFileId) {
          await deleteFromDrive(gem.googleDriveFileId)
        }

        const uploadResult = await uploadToDrive(req.file)
        gem.imageUrl = uploadResult.link
        gem.googleDriveFileId = uploadResult.id
      }

      // Update other fields if present in body
      // We'll allow updates to basic info fields
      const basicFields = [
        "color",
        "emeraldWeight",
        "diamondWeight",
        "totalArticleWeight",
        "shape",
        "cut",
        "itemDescription",
        "status",
        "currentAssignee",
        "customerId",
        "test1",
        "test2",
        "finalApproval",
      ]

      basicFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          // Handle nested objects if they come as strings (sometimes from FormData)
          if (
            typeof req.body[field] === "string" &&
            (field === "test1" || field === "test2" || field === "finalApproval")
          ) {
            try {
              gem[field] = JSON.parse(req.body[field])
            } catch (e) {
              // Not a JSON string, ignore or handle
            }
          } else {
            gem[field] = req.body[field]
          }
        }
      })

      const updatedGem = await gem.save()
      res.json(updatedGem)
    } else {
      res.status(404).json({ message: "Gem not found" })
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating gem", error: error.message })
  }
}

// @desc    Update gem with test results (Tester)
// @route   PUT /api/gems/:id/test
// @access  Private/Tester
export const submitTest = async (req, res) => {
  const { ri, sg, hardness, observations, notes, selectedVariety } = req.body
  const gem = await Gem.findById(req.params.id)

  if (!gem) {
    return res.status(404).json({ message: "Gem not found" })
  }

  // Ensure current user is the assignee
  if (gem.currentAssignee?.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You are not the current assignee for this gem" })
  }

  if (gem.status === "READY_FOR_T1") {
    // Save history if this is a resubmission
    if (gem.test1 && gem.test1.timestamp) {
      const historyItem = {
        ri: gem.test1.ri,
        sg: gem.test1.sg,
        hardness: gem.test1.hardness,
        selectedVariety: gem.test1.selectedVariety,
        observations: gem.test1.observations,
        notes: gem.test1.notes,
        testerId: gem.test1.testerId,
        timestamp: gem.test1.timestamp,
      }
      gem.test1.history = gem.test1.history || []
      gem.test1.history.push(historyItem)
    }

    gem.test1.ri = ri
    gem.test1.sg = sg
    gem.test1.hardness = hardness
    gem.test1.observations = observations
    gem.test1.notes = notes
    gem.test1.selectedVariety = selectedVariety
    gem.test1.testerId = req.user._id
    gem.test1.timestamp = new Date()
    gem.test1.correctionRequested = false

    gem.status = "READY_FOR_T2"
    gem.currentAssignee = gem.assignedTester2
  } else if (gem.status === "READY_FOR_T2") {
    // Save history if this is a resubmission
    if (gem.test2 && gem.test2.timestamp) {
      const historyItem = {
        ri: gem.test2.ri,
        sg: gem.test2.sg,
        hardness: gem.test2.hardness,
        selectedVariety: gem.test2.selectedVariety,
        observations: gem.test2.observations,
        notes: gem.test2.notes,
        testerId: gem.test2.testerId,
        timestamp: gem.test2.timestamp,
      }
      gem.test2.history = gem.test2.history || []
      gem.test2.history.push(historyItem)
    }

    gem.test2.ri = ri
    gem.test2.sg = sg
    gem.test2.hardness = hardness
    gem.test2.observations = observations
    gem.test2.notes = notes
    gem.test2.selectedVariety = selectedVariety
    gem.test2.testerId = req.user._id
    gem.test2.timestamp = new Date()
    gem.test2.correctionRequested = false

    gem.status = "READY_FOR_APPROVAL"
    gem.currentAssignee = null // Admin queue
  } else {
    return res.status(400).json({ message: "Invalid status for testing" })
  }

  const updatedGem = await gem.save()
  res.json(updatedGem)
}

// @desc    Request correction from a tester (Admin)
// @route   PUT /api/gems/:id/request-correction
// @access  Private/Admin
export const requestCorrection = async (req, res) => {
  const { stage, note } = req.body
  const gem = await Gem.findById(req.params.id)

  if (!gem) {
    return res.status(404).json({ message: "Gem not found" })
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Only administrators can request corrections" })
  }

  if (stage === "test1") {
    gem.test1.correctionRequested = true
    gem.test1.correctionNote = note
    gem.status = "READY_FOR_T1"
    gem.currentAssignee = gem.assignedTester1
  } else if (stage === "test2") {
    gem.test2.correctionRequested = true
    gem.test2.correctionNote = note
    gem.status = "READY_FOR_T2"
    gem.currentAssignee = gem.assignedTester2
  } else {
    return res.status(400).json({ message: "Invalid stage for correction" })
  }

  const updatedGem = await gem.save()
  res.json(updatedGem)
}

// @desc    Final approval (Approver)
// @route   PUT /api/gems/:id/approve
// @access  Private/Approver
export const approveGem = async (req, res) => {
  const { ri, sg, hardness, finalObservations, finalVariety, itemDescription } = req.body
  const gem = await Gem.findById(req.params.id)

  if (gem) {
    gem.finalApproval = {
      ri,
      sg,
      hardness,
      finalObservations,
      finalVariety,
      itemDescription,
      approverId: req.user._id,
      timestamp: new Date(),
    }
    gem.status = "COMPLETED"
    gem.currentAssignee = null

    const updatedGem = await gem.save()
    res.json(updatedGem)
  } else {
    res.status(404).json({ message: "Gem not found" })
  }
}
