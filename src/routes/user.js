import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import validator from 'validator'
import utils from '../utils'
import email from '../email'

const router = new Router()
const max = (process.env.NODE_ENV !== 'production') ? 50000 : 5
const loginLimiter = rateLimit({
	windowMs: 60 * 60 * 1000,
	max: max,
	message: "Too many login attempts for this IP. Please try again later."
})

// User login.
router.post('/login', loginLimiter, async (req, res) => {
  const response = new utils.Response()
	try {
		const { email, password } = req.body
		if (validator.isEmail(email)) {
			const token = await req.context.models.User.findByLogin(email.toLowerCase(), password)
			if (token) {
				
				response.setMessage(token)
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

	return res.status(response.getCode()).send(response.getMessage())
})

// Password reset
router.post('/reset/:email', loginLimiter, async(req, res) => {
  const response = new utils.Response()
	try {
		if (validator.isEmail(req.params.email)) {
			const user = await req.context.models.User.findOne({
				where: {
					email: req.params.email.toLowerCase()
				},
				attributes: ['id', 'email']
			})
			if (user) {
				// short-lived temporary token that only lasts one hour
				const temporaryToken = await req.context.models.User.getToken(user.id, user.email, '1h')

				// send forgot password email
				await email.sendForgotPassword(user.email, temporaryToken)

				
				response.setMessage(`Password reset email sent`)
			} else {
				
				response.setMessage(`Password reset email sent`)
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

// Gets all users.
router.get('/', utils.authMiddleware, async (req, res) => {
  const response = new utils.Response()
	try {
		const users = await req.context.models.User.findAll({
			attributes: ['id', 'email', 'displayName', 'phone', 'attributes', 'createdAt', 'updatedAt']
		})

		const e = await utils.loadCasbin()

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

// Gets a specific user.
router.get('/:email', utils.authMiddleware, async (req, res) => {
  const response = new utils.Response()
	try {
		if (validator.isEmail(req.params.email)) {
			const user = await req.context.models.User.findOne({
				where: {
					email: req.params.email.toLowerCase()
				},
				attributes: ['id', 'email', 'displayName', 'phone', 'createdAt', 'updatedAt']
			})
			if (user) {
				const e = await utils.loadCasbin()
				const roles = await e.getRolesForUser(user.email)

				user.dataValues.roles = roles

				/** @todo add contact info for users */
				// user.dataValues.contact = await req.context.models.Contact.findByUserId(user.id)
			} else {
				return utils.response(res, 422)
			}

			
			response.setMessage(user)
		} else {
			response.setCode(400)
		}
	} catch (e) {
		console.error(e)
		response.setCode(500)
	}

	return res.status(response.getCode()).send(response.getMessage())
})

// Creates a new user. 
router.post('/', utils.authMiddleware, async (req, res) => {
  const response = new utils.Response()
	try {
		if (validator.isEmail(req.body.email) && utils.validatePassword(req.body.password)) {
			const { email, password, roles } = req.body
			const user = await req.context.models.User.create({ email: email.toLowerCase(), password })

			if (roles !== undefined) {
				const e = await utils.loadCasbin()
				for (const role of roles) {
					await e.addRoleForUser(email.toLowerCase(), role)
				}
			}

			
			response.setMessage(user.email + ' created')
		} else {
			response.setCode(400)
		}
	} catch (e) {
		console.error(e)
		response.setCode(500)
	}

	return res.status(response.getCode()).send(response.getMessage())
})

// Updates any user.
router.put('/', utils.authMiddleware, async (req, res) => {
  const response = new utils.Response()
	try {
		if (validator.isEmail(req.body.email)) {
			/** @todo add email and phone update options */
			const { email, password, displayName, phone, attributes } = req.body
			const user = await req.context.models.User.findOne({
				where: {
					email: email.toLowerCase()
				}
			})
			/** @todo add ability to change email */
			

			/** @todo when roles are added make sure only admin or relevant user can change password */
			if (!process.env.BYPASS_LOGIN) {
				const e = await utils.loadCasbin()
				const roles = await e.getRolesForUser(req.context.me.email)
	
				if (password) {
					if (req.context.me.email === email || roles.includes('admin') && utils.validatePassword(password)) {
						user.password = password
					}
				}

				/** @todo this is half-baked. Once updating users is available through the front-end this should be revisited. */
				if (roles !== undefined) {
					const e = await utils.loadCasbin()
					for (const role of roles) {
						await e.addRoleForUser(email.toLowerCase(), role)
					}
				}
			}

			user.displayName = (displayName) ? displayName : user.displayName
			user.phone = (phone) ? phone : user.phone
			user.attributes = (attributes) ? attributes : user.attributes

			user.updatedAt = new Date()

			await user.save()

			
			response.setMessage(user.email + ' updated')
		} else {
			response.setCode(400)
		}
	} catch (e) {
		console.error(e)
		response.setCode(500)
	}

	return res.status(response.getCode()).send(response.getMessage())
})

// Deletes a user.
router.delete('/:email', utils.authMiddleware, async (req, res) => {
  const response = new utils.Response()
	try {
		if (validator.isEmail(req.params.email)) {
			const user = await req.context.models.User.findOne({
				where: {
					email: req.params.email.toLowerCase()
				}
			})

			const e = await utils.loadCasbin()
			await e.deleteRolesForUser(req.params.email.toLowerCase())


			await user.destroy()

			
			response.setMessage(req.params.email + ' deleted')
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
