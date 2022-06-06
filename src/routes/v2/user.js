import { Router } from 'express'
import { loadCasbin, authMiddleware } from '../../utils/v2'

const router = new Router()


router.get('/', authMiddleware, async (req, res) => {
  const response = new Response()
  try {
    const users = await req.context.models.User.findAll({
      attributes: ['id', 'email', 'displayName', 'phone', 'attributes', 'createdAt', 'updatedAt']
    })

    const e = await loadCasbin()

    for (const user of users) {
      const roles = await e.getRolesForUser(user.email)

      user.dataValues.roles = roles
    }


    response.setMessage({
      _meta: {
        total: users.length
      },
      results: users
    })
  } catch (e) {
    console.error(e)
    response.setCode(500)
  }

  return res.status(response.getCode()).send(response.getMessage())
})