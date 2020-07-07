import { Router } from 'express'
import utils from '../utils'

const router = new Router()
router.use(utils.authMiddleware)

// Gets all roles.
router.get('/', async (req, res) => {
  const response = new utils.Response()
  try {
    const e = await utils.loadCasbin()
    const rolesRaw = await e.getNamedPolicy('p')
    const roles = {}


    for (const role of rolesRaw) {
      if (roles[role[0]] !== undefined) {
        roles[role[0]].push({
          path: role[1],
          method: role[2]
        })
      } else {
        roles[role[0]] = [{
          path: role[1],
          method: role[2]
        }]
      }
    }


    response.setMessage(roles)
  } catch (e) {
    console.error(e)
    response.setCode(500)
  }

  return res.status(response.getCode()).send(response.getMessage())
})

// Creates a new role.
router.post('/', async (req, res) => {
  const response = new utils.Response()
  try {
    const { role, path, method } = req.body

    if (role && path && method) {
      let added = false

      const e = await utils.loadCasbin()
      const p = [role, path, method]
      added = await e.addPolicy(...p)

      if (added) {

        response.setMessage('policy created')
      } else {
        response.setCode(400)
      }
    } else {
      response.setCode(400)
    }

  } catch (e) {
    console.error(e)
    response.setCode(500)
  }

  return res.status(response.getCode()).send(response.getMessage())
})

// Deletes a role.
router.post('/delete', async (req, res) => {
  const response = new utils.Response()
  try {
    const { role, path, method } = req.body

    if (role && path && method) {
      let removed = false

      const e = await utils.loadCasbin()
      const p = [role, path, method]
      removed = await e.removePolicy(...p)

      if (removed) {
        response.setMessage('policy deleted')
      } else {
        response.setCode(400)
      }
    } else {
      response.setCode(400)
    }
  } catch (e) {
    console.error(e)
    response.setCode(500)
  }

  return res.status(response.getCode()).send(response.getMessage())
})

export default router
