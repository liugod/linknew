// Simple test to check upload functionality
// This helps identify where the upload fails

const testUploadFlow = async () => {
  console.log('Testing upload flow...')
  
  try {
    // Test 1: Check if getuploadurl endpoint exists
    console.log('1. Testing /api/images/getuploadurl endpoint...')
    const getUploadUrlResponse = await fetch('http://localhost:3000/api/images/getuploadurl')
    console.log('Status:', getUploadUrlResponse.status)
    
    if (!getUploadUrlResponse.ok) {
      console.error('❌ getuploadurl failed:', getUploadUrlResponse.statusText)
      return
    }
    
    const uploadData = await getUploadUrlResponse.json()
    console.log('✅ getuploadurl response:', uploadData)
    
    // Test 2: Check if createblurpfp endpoint exists (with dummy data)
    console.log('2. Testing /api/images/createblurpfp endpoint...')
    const testImageUrl = 'https://imagedelivery.net/dummy/test.jpg'
    
    const blurResponse = await fetch('http://localhost:3000/api/images/createblurpfp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageurl: testImageUrl })
    })
    
    console.log('Status:', blurResponse.status)
    if (blurResponse.ok) {
      const blurData = await blurResponse.json()
      console.log('✅ createblurpfp response:', blurData)
    } else {
      console.error('❌ createblurpfp failed:', blurResponse.statusText)
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testUploadFlow()
}

module.exports = { testUploadFlow }