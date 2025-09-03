import jimp from 'jimp'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const imageURL = req.body.imageurl as string

  if (!imageURL) {
    return res.status(400).json({ error: 'Image URL is required' })
  }

  try {
    // Add timeout to prevent Vercel function timeout
    const timeoutMs = 8000 // 8 seconds, leaving 2 seconds buffer for Vercel's 10s limit

    const imageProcessing = Promise.race([
      processImage(imageURL),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Image processing timeout')), timeoutMs)
      ),
    ])

    const result = await imageProcessing
    res.status(200).json(result)
  } catch (error) {
    console.error('Blur image creation error:', error)
    res.status(500).json({
      error: error.message || 'Failed to create blur image',
      success: false,
    })
  }
}

async function processImage(imageURL: string) {
  const image = await jimp.read(imageURL)
  image.resize(5, jimp.AUTO)

  const resizedImageBuffer = await image.getBufferAsync(jimp.MIME_JPEG)
  const imageBase64 = resizedImageBuffer.toString('base64')

  return { blurpfp: imageBase64, success: true }
}
