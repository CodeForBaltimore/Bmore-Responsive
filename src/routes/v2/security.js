import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import { ErrorResponse } from '../../utils/v2'

const router = new Router()
const max = (process.env.NODE_ENV !== 'production') ? 50000 : 50
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max,
  message: 'Too many login attempts for this IP. Please try again later.'
})

router.post('/authenticate', loginLimiter, async (req, res) => {
  let response
  try {
    const { email, password } = req.body
    if (validator.isEmail(email)) {
      const token = await req.context.models.User.findByLogin(email.toLowerCase(), password)
      if (token) {
        const { exp } = jwt.decode(token)
        return res.status(200).json({
          'token': token,
          'expiresAt': exp
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