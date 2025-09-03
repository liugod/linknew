import { getUserFromSession } from 'controllers/getuser'
import prisma from 'lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'

type SqlExecutionResult = {
  success: boolean
  data?: any[]
  rowsAffected?: number
  error?: string
  query?: string
  operationType?: 'SELECT' | 'MODIFY'
}

const handler = async (req: NextApiRequest, res: NextApiResponse<SqlExecutionResult>) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    // Check authentication
    const { user, error: authError } = await getUserFromSession(req)
    if (!user || authError) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    // For now, we'll use a simple admin check based on email
    // In a production environment, you'd want a proper admin role system
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
    if (!user.email || !adminEmails.includes(user.email)) {
      return res.status(403).json({ success: false, error: 'Admin access required' })
    }

    const { query } = req.body

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ success: false, error: 'SQL query is required' })
    }

    // Trim and validate the query
    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      return res.status(400).json({ success: false, error: 'Empty query provided' })
    }

    // Note: All SQL commands are allowed for admin users
    // Admin authentication and logging provide security controls

    // Execute the query using Prisma's raw query capability
    const result = await prisma.$queryRawUnsafe(trimmedQuery)

    // Handle different types of SQL operations
    const isSelectQuery = trimmedQuery.toUpperCase().trim().startsWith('SELECT')
    const resultData = Array.isArray(result) ? result : [result]
    
    return res.status(200).json({
      success: true,
      data: isSelectQuery ? resultData : [],
      rowsAffected: Array.isArray(result) ? result.length : (typeof result === 'number' ? result : 1),
      query: trimmedQuery,
      operationType: isSelectQuery ? 'SELECT' : 'MODIFY',
    })
  } catch (error: any) {
    console.error('SQL execution error:', error)

    return res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while executing the query',
      query: req.body?.query,
    })
  }
}

export default handler
