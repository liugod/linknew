// you have a couple options here:
// 1. setup loops, sendgrid, mailgun, etc and use the code below
// 2. only send emails for auth and use SMPT (see /api/auth/nextauth.ts)
// 3. don't send any emails at all (rm email option in /components/auth)

const TRANSACTIONAL_URL = 'https://app.loops.so/api/v1/transactional'
const LOOPS_API_KEY = process.env.LOOPS_API_KEY
const DISABLE_EMAIL_SENDING = process.env.DISABLE_EMAIL_SENDING === 'true'

export const sendMagicLink = async (email: string, link: string) => {
  const TRANSACTIONAL_ID = 'cmeo5f3ed0q0s480idbzjnlkz'

  // If email sending is explicitly disabled, just log and return success
  if (DISABLE_EMAIL_SENDING) {
    console.log(`Email sending disabled. Would send magic link to: ${email}`)
    console.log(`Magic link URL: ${link}`)
    return { success: true, disabled: true }
  }

  // Check if API key is configured
  if (!LOOPS_API_KEY) {
    console.warn('LOOPS_API_KEY is not configured. Cannot send magic link email.')
    console.log(`For development: Magic link URL for ${email}: ${link}`)
    // In development mode, don't fail hard - just log the link
    if (process.env.NODE_ENV === 'development') {
      return { success: true, development: true }
    }
    throw new Error('Email service not configured')
  }

  try {
    const response = await fetch(TRANSACTIONAL_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOOPS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transactionalId: TRANSACTIONAL_ID,
        email: email,
        dataVariables: { MagicLink: link },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Failed to send magic link email. Status: ${response.status}, Response: ${errorText}`)
      
      // Try to parse the error response for better logging
      try {
        const errorJson = JSON.parse(errorText)
        console.error('Loops API Error Details:', errorJson)
      } catch {
        // Error response is not JSON
      }
      
      // In development, don't fail hard on email errors
      if (process.env.NODE_ENV === 'development') {
        console.log(`Development mode: Magic link URL for ${email}: ${link}`)
        return { success: true, development: true, error: errorText }
      }
      
      throw new Error(`Email sending failed: ${response.status}`)
    }

    const result = await response.json()
    console.log('Successfully sent magic link email to:', email)
    return result
  } catch (error) {
    console.error('Error sending magic link email:', error)
    
    // In development mode, provide the magic link directly instead of failing
    if (process.env.NODE_ENV === 'development') {
      console.log(`Development mode: Magic link URL for ${email}: ${link}`)
      return { success: true, development: true, error: error.message }
    }
    
    throw error
  }
}
