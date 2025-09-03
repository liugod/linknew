type UploadFileResponse = {
  error?: string
  imageURL?: string
  blurpfp?: string
}

export async function uploadFile(file: File, isPfp?: boolean): Promise<UploadFileResponse> {
  try {
    // Step 1: Get upload URL from Cloudflare
    const getuploadurl = await fetch('/api/images/getuploadurl')
    if (!getuploadurl.ok) {
      return { error: `Failed to get upload URL: ${getuploadurl.status}` }
    }

    const response = await getuploadurl.json()
    if (!response.uploadURL) {
      return { error: 'No upload URL received from server' }
    }

    const uploadURL = response.uploadURL

    // Step 2: Upload file to Cloudflare
    const formData = new FormData()
    formData.append('file', file)

    const upload = await fetch(uploadURL, { method: 'POST', body: formData })
    if (!upload.ok) {
      return { error: `Upload failed: ${upload.status}` }
    }

    const uploadResponse = await upload.json()
    if (!uploadResponse.success) {
      const errorMessage = uploadResponse.errors?.[0]?.message || 'Upload failed'
      return { error: errorMessage }
    }

    const imageURL = uploadResponse.result?.variants?.[0]
    if (!imageURL) {
      return { error: 'No image URL received from upload' }
    }

    if (!isPfp) return { imageURL: imageURL }

    // Step 3: Create blur profile picture
    try {
      const createblurpfp = await fetch('/api/images/createblurpfp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageurl: imageURL }),
      })

      if (!createblurpfp.ok) {
        // If blur creation fails, still return the image URL
        console.warn('Blur creation failed, continuing without blur')
        return { imageURL: imageURL, blurpfp: '' }
      }

      const blurResponse = await createblurpfp.json()
      const blurpfp = blurResponse.blurpfp || ''

      return { imageURL: imageURL, blurpfp: blurpfp }
    } catch (blurError) {
      // If blur creation fails, still return the image URL
      console.warn('Blur creation error:', blurError)
      return { imageURL: imageURL, blurpfp: '' }
    }
  } catch (error) {
    console.error('Upload error:', error)
    return { error: `Upload failed: ${error.message || 'Unknown error'}` }
  }
}
