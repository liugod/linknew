import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check if required environment variables are present
    if (!process.env.CLOUDFLARE_ACCOUNT || !process.env.CLOUDFLARE_TOKEN) {
      return res.status(500).json({
        error: 'Missing Cloudflare configuration',
        uploadURL: null,
      })
    }

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT}/images/v2/direct_upload`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}` },
      }
    )

    const data = await response.json()

    // Check if the Cloudflare API call was successful
    if (!response.ok || !data.success || !data.result) {
      return res.status(500).json({
        error: 'Failed to get upload URL from Cloudflare',
        uploadURL: null,
      })
    }

    res.status(200).json(data.result)
  } catch (error) {
    console.error('Error in getuploadurl:', error)
    res.status(500).json({
      error: 'Internal server error',
      uploadURL: null,
    })
  }
}
