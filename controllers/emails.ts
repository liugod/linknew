// you have a couple options here:
// 1. setup loops, sendgrid, mailgun, etc and use the code below
// 2. only send emails for auth and use SMPT (see /api/auth/nextauth.ts)
// 3. don't send any emails at all (rm email option in /components/auth)

const TRANSACTIONAL_URL = 'https://app.loops.so/api/v1/transactional'
const LOOPS_API_KEY = process.env.LOOPS_API_KEY

export const sendMagicLink = async (email: string, link: string) => {
  const TRANSACTIONAL_ID = 'cllzh85eg01b9k30pww3y5giy'

  // Check if LOOPS_API_KEY is configured
  if (!LOOPS_API_KEY) {
    const error = 'LOOPS_API_KEY environment variable is not set'
    console.error('Email sending failed:', error)
    throw new Error(error)
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
      const error = `Email API request failed: ${response.status} ${response.statusText} - ${errorText}`
      console.error('Email sending failed:', error)
      throw new Error(error)
    }

    console.log('Successfully sent magic link to:', email)
  } catch (error) {
    console.error('Email sending failed:', error)
    throw error
  }
}
