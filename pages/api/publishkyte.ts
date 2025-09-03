import { syncDraftToProd } from 'controllers/editkyte'
import { getUserFromNextAuth } from 'controllers/getuser'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user, error } = await getUserFromNextAuth(req, res)
  if (!user || error) return res.status(400).json({ error })

  await syncDraftToProd(user.id)

  return res.status(200).json({ success: true })
}

export default handler
