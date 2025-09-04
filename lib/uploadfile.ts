/**
 * 文件上传工具函数
 * 处理图片上传到Cloudflare Images的完整流程
 */
type UploadFileResponse = {
  error?: string
  imageURL?: string
  blurpfp?: string
}

export async function uploadFile(file: File, isPfp?: boolean): Promise<UploadFileResponse> {
  try {
    // 前置验证：文件大小和格式
    const maxSize = 10 * 1024 * 1024 // 10MB Cloudflare Images限制
    if (file.size > maxSize) {
      return { error: '文件过大，最大支持10MB' }
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return { error: '不支持的文件格式，仅支持 JPEG、PNG、GIF、WebP' }
    }

    console.log('开始上传流程:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    })

    // 步骤1: 获取上传URL
    const getuploadurl = await fetch('/api/images/getuploadurl', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await getuploadurl.json()

    // 检查API调用是否成功
    if (!getuploadurl.ok || response.error || !response.uploadURL) {
      console.error('获取上传URL失败:', {
        status: getuploadurl.status,
        error: response.error,
        hasUploadURL: !!response.uploadURL,
      })
      return { error: response.error || '获取上传URL失败' }
    }

    const uploadURL = response.uploadURL
    console.log('上传URL获取成功, 开始上传文件...')

    // 步骤2: 上传文件到Cloudflare
    const formData = new FormData()
    formData.append('file', file)

    // 添加元数据
    formData.append(
      'metadata',
      JSON.stringify({
        filename: file.name,
        source: 'linknew',
        uploadTime: new Date().toISOString(),
      })
    )

    const upload = await fetch(uploadURL, {
      method: 'POST',
      body: formData,
      // 添加超时和重试机制
      signal: AbortSignal.timeout(60000), // 60秒超时
    })

    const uploadResponse = await upload.json()

    console.log('上传响应:', {
      success: uploadResponse.success,
      hasResult: !!uploadResponse.result,
      errors: uploadResponse.errors,
      status: upload.status,
    })

    // 处理上传失败
    if (!uploadResponse.success) {
      const errorMessage = uploadResponse.errors?.[0]?.message || '上传失败'
      console.error('Cloudflare上传失败:', uploadResponse.errors)

      // 特殊处理403错误
      if (upload.status === 403) {
        return { error: 'Cloudflare Images权限不足，请检查域名和API配置' }
      }

      return { error: errorMessage }
    }

    // 获取图片URL
    const imageURL = uploadResponse.result.variants[0]
    console.log('图片上传成功:', imageURL)

    // 如果不是头像，直接返回
    if (!isPfp) return { imageURL: imageURL }

    // 步骤3: 生成模糊头像（仅头像需要）
    try {
      const createblurpfp = await fetch('/api/images/createblurpfp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageurl: imageURL }),
      })

      const blurpfpResponse = await createblurpfp.json()

      // 模糊头像生成失败不影响主流程
      if (!createblurpfp.ok || !blurpfpResponse.success) {
        console.warn('模糊头像生成失败，继续使用原图')
        return { imageURL: imageURL, blurpfp: '' }
      }

      return { imageURL: imageURL, blurpfp: blurpfpResponse.blurpfp }
    } catch (blurError) {
      console.warn('模糊头像生成错误:', blurError)
      return { imageURL: imageURL, blurpfp: '' }
    }
  } catch (error) {
    console.error('uploadFile错误:', error)

    // 提供具体错误信息
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return { error: '网络错误：请检查网络连接' }
    }

    if (error instanceof Error && error.name === 'TimeoutError') {
      return { error: '上传超时：文件过大或网络较慢' }
    }

    if (error instanceof Error && error.name === 'AbortError') {
      return { error: '上传被取消' }
    }

    return { error: '上传失败：网络或服务器错误' }
  }
}
