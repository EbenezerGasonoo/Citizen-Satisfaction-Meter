import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'
import formidable, { Fields, Files } from 'formidable'

export const config = {
  api: {
    bodyParser: false,
  },
}

const uploadDir = path.join(process.cwd(), 'public', 'uploads')

async function ensureUploadDir() {
  try {
    await fs.access(uploadDir)
  } catch {
    await fs.mkdir(uploadDir, { recursive: true })
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  await ensureUploadDir()
  const form = formidable({ multiples: false, uploadDir, keepExtensions: true })
  form.parse(req, async (err: any, fields: Fields, files: Files) => {
    if (err) {
      console.error('Upload error:', err)
      return res.status(500).json({ error: 'Upload failed' })
    }
    const file = files.file
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }
    const uploadedFile = Array.isArray(file) ? file[0] : file
    const ext = path.extname(uploadedFile.originalFilename || uploadedFile.newFilename)
    if (!['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid file type' })
    }
    const fileName = `${Date.now()}_${uploadedFile.newFilename}`
    const destPath = path.join(uploadDir, fileName)
    await fs.rename(uploadedFile.filepath, destPath)
    const fileUrl = `/uploads/${fileName}`
    return res.status(200).json({ url: fileUrl })
  })
} 