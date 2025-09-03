// Email functionality has been moved to NextAuth's built-in SMTP provider
// See /pages/api/auth/[...nextauth].ts for SMTP configuration
// 
// Previous implementation used Loops API, but now uses SMTP for better
// self-hosting capabilities and fewer external dependencies.

// Legacy Loops implementation (no longer used):
const TRANSACTIONAL_URL = 'https://app.loops.so/api/v1/transactional'
const LOOPS_API_KEY = process.env.LOOPS_API_KEY

export const sendMagicLink = async (email: string, link: string) => {
  console.warn('sendMagicLink function is deprecated. Email sending is now handled by NextAuth SMTP provider.')
  throw new Error('This function is no longer used. Email sending is handled by NextAuth SMTP provider in /pages/api/auth/[...nextauth].ts')
}
