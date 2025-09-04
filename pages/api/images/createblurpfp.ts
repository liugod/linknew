import jimp from 'jimp'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const imageURL = req.body.imageurl as string

    if (!imageURL) {
      return res.status(400).json({ error: 'Image URL is required', success: false })
    }

    const image = await jimp.read(imageURL)
    image.resize(5, jimp.AUTO)

    const resizedImageBuffer = await image.getBufferAsync(jimp.MIME_JPEG)
    const imageBase64 = resizedImageBuffer.toString('base64')

    res.status(200).json({ blurpfp: imageBase64, success: true })
  } catch (error) {
    console.error('Error creating blur profile picture:', error)
    res.status(500).json({ error: 'Failed to create blur profile picture', success: false })
  }
}
