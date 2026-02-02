import { google } from "googleapis"
import { Readable } from "stream"
import dotenv from "dotenv"

dotenv.config()

const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET
const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
})

/**
 * Uploads a file to Google Drive
 * @param {Object} file - The file object from multer (memoryStorage)
 * @returns {Promise<Object>} - The uploaded file data (id and webViewLink)
 */
export const uploadToDrive = async (file) => {
  try {
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID

    const fileMetadata = {
      name: `${Date.now()}-${file.originalname}`,
      parents: folderId ? [folderId] : [],
    }

    const media = {
      mimeType: file.mimetype,
      body: Readable.from(file.buffer),
    }

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id, webViewLink, webContentLink",
    })

    const fileId = response.data.id

    // Set permissions to public
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    })

    // Return the direct link if possible, or just the ID
    // For direct image display, we often use: https://lh3.googleusercontent.com/u/0/d/{fileId}
    // or https://drive.google.com/thumbnail?id={fileId}&sz=w1000
    // But the most reliable for <img> tags is the custom thumbnail URL or a proxy
    return {
      id: fileId,
      link: `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`, // Using thumbnail as a direct link hack
    }
  } catch (error) {
    console.error("Google Drive Upload Error:", error)
    throw error
  }
}

/**
 * Deletes a file from Google Drive
 * @param {string} fileId - The ID of the file to delete
 */
export const deleteFromDrive = async (fileId) => {
  try {
    await drive.files.delete({
      fileId: fileId,
    })
  } catch (error) {
    console.error("Google Drive Delete Error:", error)
    // Don't throw if file not found
  }
}
