type UploadFileResponse = {
  error?: string
  imageURL?: string
  blurpfp?: string
}

export async function uploadFile(file: File, isPfp?: boolean): Promise<UploadFileResponse> {
  try {
    console.log('Starting upload for file:', file.name, 'Size:', file.size, 'isPfp:', isPfp)
    
    // Step 1: Get upload URL from Cloudflare
    const getuploadurl = await fetch('/api/images/getuploadurl', { method: 'POST' })
    if (!getuploadurl.ok) {
      console.error('getuploadurl failed:', getuploadurl.status, getuploadurl.statusText)
      return { error: `Failed to get upload URL: ${getuploadurl.status}` }
    }

    const response = await getuploadurl.json()
    if (!response.uploadURL) {
      console.error('No upload URL in response:', response)
      return { error: 'No upload URL received from server' }
    }

    const uploadURL = response.uploadURL
    console.log('Got upload URL successfully')

    // Step 2: Upload file to Cloudflare
    const formData = new FormData()
    formData.append('file', file)

    console.log('Uploading to Cloudflare...')
    const upload = await fetch(uploadURL, { method: 'POST', body: formData })
    if (!upload.ok) {
      console.error('Cloudflare upload failed:', upload.status, upload.statusText)
      return { error: `Upload failed: ${upload.status}` }
    }

    const uploadResponse = await upload.json()
    if (!uploadResponse.success) {
      const errorMessage = uploadResponse.errors?.[0]?.message || 'Upload failed'
      console.error('Cloudflare upload response error:', uploadResponse)
      return { error: errorMessage }
    }

    const imageURL = uploadResponse.result?.variants?.[0]
    if (!imageURL) {
      console.error('No image URL in upload response:', uploadResponse)
      return { error: 'No image URL received from upload' }
    }

    console.log('Cloudflare upload successful, image URL:', imageURL)

    if (!isPfp) return { imageURL: imageURL }

    // Step 3: Create blur profile picture
    try {
      console.log('Creating blur image...')
      const createblurpfp = await fetch('/api/images/createblurpfp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageurl: imageURL }),
      })

      if (!createblurpfp.ok) {
        // If blur creation fails, still return the image URL
        console.warn('Blur creation failed with status:', createblurpfp.status, 'continuing without blur')
        return { imageURL: imageURL, blurpfp: '' }
      }

      const blurResponse = await createblurpfp.json()
      const blurpfp = blurResponse.blurpfp || ''

      console.log('Blur creation successful')
      return { imageURL: imageURL, blurpfp: blurpfp }
    } catch (blurError) {
      // If blur creation fails, still return the image URL
      console.warn('Blur creation error:', blurError, 'continuing without blur')
      return { imageURL: imageURL, blurpfp: '' }
    }
  } catch (error) {
    console.error('Upload error:', error)
    return { error: `Upload failed: ${error.message || 'Unknown error'}` }
  }
}
