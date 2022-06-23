import { Router } from 'express'
import { authMiddleware } from '../../utils/v2'

const router = new Router()


router.get('/', authMiddleware, async (req, res) => {
  let response
  try {
    const users = await req.context.models.User.findAll({
      attributes: ['email', 'displayName']
    })

    return res.status(200).json(users)
  } catch (e) {
    console.error(e)
    response.setCode(500)
  }

  return res.status(response.getCode()).json(response.getMessage())
})

export default router