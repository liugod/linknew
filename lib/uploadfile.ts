type UploadFileResponse = {
  error?: string
  imageURL?: string
  blurpfp?: string
}

export async function uploadFile(file: File, isPfp?: boolean): Promise<UploadFileResponse> {
  try {
    const getuploadurl = await fetch('/api/images/getuploadurl')
    const response = await getuploadurl.json()

    // Check if the API call failed or uploadURL is missing
    if (!getuploadurl.ok || response.error || !response.uploadURL) {
      return { error: response.error || 'Failed to get upload URL' }
    }

    const uploadURL = response.uploadURL

    const formData = new FormData()
    formData.append('file', file)

    const upload = await fetch(uploadURL, { method: 'POST', body: formData })
    const uploadResponse = await upload.json()
    if (!uploadResponse.success) return { error: uploadResponse.errors[0].message }

    const imageURL = uploadResponse.result.variants[0]

    if (!isPfp) return { imageURL: imageURL }

    try {
      const createblurpfp = await fetch('/api/images/createblurpfp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageurl: imageURL }),
      })

      const blurpfpResponse = await createblurpfp.json()

      // If blur pfp creation fails, still return the main image URL
      if (!createblurpfp.ok || !blurpfpResponse.success) {
        console.warn('Failed to create blur profile picture, proceeding without it')
        return { imageURL: imageURL, blurpfp: '' }
      }

      return { imageURL: imageURL, blurpfp: blurpfpResponse.blurpfp }
    } catch (blurError) {
      console.warn('Error creating blur profile picture:', blurError)
      // Return the main image URL even if blur pfp creation fails
      return { imageURL: imageURL, blurpfp: '' }
    }
  } catch (error) {
    console.error('Error in uploadFile:', error)
    return { error: 'Upload failed due to network or server error' }
  }
}
