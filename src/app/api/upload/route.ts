import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import formidable from 'formidable'
import type { Fields, Files } from 'formidable'

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

export async function POST(req: NextRequest) {
  await ensureUploadDir()
  const form = formidable({ multiples: false, uploadDir, keepExtensions: true })

  // Convert NextRequest to Node.js IncomingMessage
  const nodeReq = req as any

  return new Promise((resolve, reject) => {
    form.parse(nodeReq, async (err: any, fields: Fields, files: Files) => {
      if (err) {
        console.error('Upload error:', err)
        return resolve(NextResponse.json({ error: 'Upload failed' }, { status: 500 }))
      }
      const file = files.file
      if (!file) {
        return resolve(NextResponse.json({ error: 'No file uploaded' }, { status: 400 }))
      }
      const uploadedFile = Array.isArray(file) ? file[0] : file
      const ext = path.extname(uploadedFile.originalFilename || uploadedFile.newFilename)
      if (!['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext.toLowerCase())) {
        return resolve(NextResponse.json({ error: 'Invalid file type' }, { status: 400 }))
      }
      const fileName = `${Date.now()}_${uploadedFile.newFilename}`
      const destPath = path.join(uploadDir, fileName)
      await fs.rename(uploadedFile.filepath, destPath)
      const fileUrl = `/uploads/${fileName}`
      return resolve(NextResponse.json({ url: fileUrl }))
    })
  })
} 