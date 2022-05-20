import { Router } from 'express'
import validator from 'validator'
import { Response } from '../../utils/v1'

const router = new Router()

router.get('/authenticate', async (req, res) => {
  const response = new Response()
  try {
    const { email, password } = req.body
    if (validator.isEmail(email)) {
      const token = await req.context.models.User.findByLogin(email.toLowerCase(), password)
      if (token) {
        console.log(token)
        response.setMessage({
          "token": token,
        })
      } else {
        response.setCode(403)
      }
    } else {
      response.setCode(400)
    }
  } catch (e) {
    console.error(e)
    response.setCode(500)
  }

  return res.status(response.getCode()).json(response.getMessage())
})

export default router