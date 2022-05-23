import { Router } from 'express'
import validator from 'validator'
import { ErrorResponse } from '../../utils/v2'

const router = new Router()

router.post('/authenticate', async (req, res) => {
  let response
  try {
    const { email, password } = req.body
    if (validator.isEmail(email)) {
      const token = await req.context.models.User.findByLogin(email.toLowerCase(), password)
      if (token) {
        console.log(token)
        return res.status(200).json({
          'token': token
        })
      } else {
        response = new ErrorResponse(401)
      }
    } else {
      response = new ErrorResponse(400)
      response.addDetail('email', 'Address provided is invalid')
    }
  } catch (e) {
    console.error(e)
    response = new ErrorResponse(500)
  }

  return res.status(response.getCode()).json(response.getBody())
})

export default router