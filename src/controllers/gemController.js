import Gem from "../models/Gem.js"

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
  const { color, emeraldWeight, diamondWeight, totalArticleWeight, shape, cut, itemDescription } =
    req.body

  // Generate unique gem ID if not provided
  const gemCount = await Gem.countDocuments()
  const gemId = `GEM-${new Date().getFullYear()}-${(gemCount + 1).toString().padStart(3, "0")}`

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
    imageUrl: req.file ? `/uploads/${req.file.filename}` : "",
    currentAssignee: req.body.testerId || null,
    intake: {
      helperId: req.user._id,
      timestamp: new Date(),
    },
  })

  const createdGem = await gem.save()
  res.status(201).json(createdGem)
}

// @desc    Update gem with test results (Tester)
// @route   PUT /api/gems/:id/test
// @access  Private/Tester
export const submitTest = async (req, res) => {
  const { ri, sg, hardness, observations, notes, selectedVariety } = req.body
  const gem = await Gem.findById(req.params.id)

  if (gem) {
    if (gem.status === "READY_FOR_T1") {
      gem.test1 = {
        ri,
        sg,
        hardness,
        observations,
        notes,
        selectedVariety,
        testerId: req.user._id,
        timestamp: new Date(),
      }
      gem.status = "READY_FOR_T2"
    } else if (gem.status === "READY_FOR_T2") {
      gem.test2 = {
        ri,
        sg,
        hardness,
        observations,
        notes,
        selectedVariety,
        testerId: req.user._id,
        timestamp: new Date(),
      }
      gem.status = "READY_FOR_APPROVAL"
    } else {
      return res.status(400).json({ message: "Invalid status for testing" })
    }

    const updatedGem = await gem.save()
    res.json(updatedGem)
  } else {
    res.status(404).json({ message: "Gem not found" })
  }
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

    const updatedGem = await gem.save()
    res.json(updatedGem)
  } else {
    res.status(404).json({ message: "Gem not found" })
  }
}
