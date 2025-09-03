// you have a couple options here:
// 1. setup loops, sendgrid, mailgun, etc and use the code below
// 2. only send emails for auth and use SMPT (see /api/auth/nextauth.ts)
// 3. don't send any emails at all (rm email option in /components/auth)

const TRANSACTIONAL_URL = 'https://app.loops.so/api/v1/transactional'
const LOOPS_API_KEY = process.env.LOOPS_API_KEY

export const sendMagicLink = async (email: string, link: string) => {
  const TRANSACTIONAL_ID = 'cmeo5f3ed0q0s480idbzjnlkz'

  // Check if API key is configured
  if (!LOOPS_API_KEY) {
    console.error('LOOPS_API_KEY is not configured. Cannot send magic link email.')
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
      throw new Error(`Email sending failed: ${response.status}`)
    }

    const result = await response.json()
    console.log('Successfully sent magic link email to:', email)
    return result
  } catch (error) {
    console.error('Error sending magic link email:', error)
    throw error
  }
}
