import { Router } from 'express'
import { authMiddleware, loadCasbin, Response } from '../../utils/v1'

const router = new Router()
router.use(authMiddleware)

// Gets all roles.
router.get('/', async (req, res) => {
  const response = new Response()
  try {
    const e = await loadCasbin()
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
  const response = new Response()
  try {
    const { role, path, method } = req.body

    if (role && path && method) {
      let added = false

      const e = await loadCasbin()
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
  const response = new Response()
  try {
    const { role, path, method } = req.body

    if (role && path && method) {
      let removed = false

      const e = await loadCasbin()
      const p = [role, path, method]
      removed = await e.removePolicy(...p)

      if (removed) {
        response.setMessage('Policy deleted')
      } else {
        response.setCode(422)
        response.setMessage('Request inconsistent with existing casbin policy')
      }
    } else {
      response.setCode(400)
      response.setMessage('Request does not inclue required parameters')
    }
  } catch (e) {
    console.error(e)
    response.setCode(500)
  }

  return res.status(response.getCode()).send(response.getMessage())
})

export default router
