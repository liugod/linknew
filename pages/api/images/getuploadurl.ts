import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT}/images/v2/direct_upload`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}` },
      }
    )

    if (!response.ok) {
      throw new Error(`Cloudflare API error: ${response.status}`)
    }

    const data = await response.json()

    if (!data.success || !data.result?.uploadURL) {
      throw new Error('Invalid response from Cloudflare API')
    }

    res.status(200).json(data.result)
  } catch (error) {
    console.error('Get upload URL error:', error)
    res.status(500).json({
      error: error.message || 'Failed to get upload URL',
      success: false,
    })
  }
}
