import { NextApiRequest, NextApiResponse } from 'next'

/**
 * API路由：获取Cloudflare Images直接上传URL
 * 处理图片上传前的预签名URL生成
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 增强环境变量检查和日志记录
    if (!process.env.CLOUDFLARE_ACCOUNT || !process.env.CLOUDFLARE_TOKEN) {
      console.error('Cloudflare配置缺失:', {
        hasAccount: !!process.env.CLOUDFLARE_ACCOUNT,
        hasToken: !!process.env.CLOUDFLARE_TOKEN,
        nodeEnv: process.env.NODE_ENV,
      })
      return res.status(500).json({
        error: 'Missing Cloudflare configuration',
        uploadURL: null,
      })
    }

    console.log('请求Cloudflare上传URL...', {
      account: process.env.CLOUDFLARE_ACCOUNT.substring(0, 8) + '...',
      timestamp: new Date().toISOString(),
    })

    // Create FormData for the upload URL request to comply with Cloudflare's requirements
    const formData = new FormData()
    formData.append('requireSignedURLs', 'false')
    formData.append(
      'metadata',
      JSON.stringify({
        source: 'linknew-app',
        timestamp: Date.now().toString(),
      })
    )

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT}/images/v2/direct_upload`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_TOKEN}`,
          // Remove Content-Type header to let browser set it with boundary for FormData
        },
        // Use FormData instead of JSON to match Cloudflare's expected format
        body: formData,
      }
    )

    const data = await response.json()

    // 详细的错误日志记录
    if (!response.ok || !data.success || !data.result) {
      console.error('Cloudflare API错误详情:', {
        status: response.status,
        statusText: response.statusText,
        success: data.success,
        errors: data.errors,
        messages: data.messages,
        result: data.result,
      })

      // 针对403错误的特殊处理
      if (response.status === 403) {
        return res.status(403).json({
          error: 'Cloudflare Images权限不足 - 请检查API Token权限配置',
          details: data.errors?.[0]?.message || '权限被拒绝',
          uploadURL: null,
        })
      }

      return res.status(500).json({
        error: `Cloudflare API Error: ${data.errors?.[0]?.message || 'Unknown error'}`,
        uploadURL: null,
      })
    }

    console.log('上传URL生成成功')
    res.status(200).json(data.result)
  } catch (error) {
    console.error('getuploadurl内部错误:', error)
    res.status(500).json({
      error: 'Internal server error',
      uploadURL: null,
    })
  }
}
