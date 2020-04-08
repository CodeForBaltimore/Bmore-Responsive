import { Router } from 'express';
import validator from 'validator';
import utils from '../utils';
import email from '../email';

const router = new Router();

// User login.
router.post('/login', async (req, res) => {
	let code;
	let message;
	try {
		const { email, password } = req.body;
		if (validator.isEmail(email)) {
			const token = await req.context.models.User.findByLogin(email.toLowerCase(), password);
			if (token) {
				code = 200;
				message = token;
			} else {
				code = 403;
			}
		} else {
			code = 422;
		}
	} catch (e) {
		console.error(e);
		code = 500;
	}

	return utils.response(res, code, message);
});

router.post('/reset/:email', async(req, res) => {
	let code;
	let message;
	try {
		if (validator.isEmail(req.params.email)) {
			const user = await req.context.models.User.findOne({
				where: {
					email: req.params.email.toLowerCase()
				},
				attributes: ['id', 'email']
			});
			if (user) {
				// short-lived temporary token that only lasts one hour
				const temporaryToken = await req.context.models.User.getToken(user.id, user.email, '1h');

				// send forgot password email
				await email.sendForgotPassword(user.email, temporaryToken);

				code = 200;
				message = `Password reset email sent`;
			} else {
				code = 200;
				message = `Password reset email sent`;
			}
		} else {
			code = 422;
		}
	} catch (e) {
		console.error(e);
		code = 500;
	}

	return utils.response(res, code, message);
});

// Gets all users.
router.get('/', utils.authMiddleware, async (req, res) => {
	let code;
	let message;
	try {
		const users = await req.context.models.User.findAll({
			attributes: ['id', 'email', 'roles', 'displayName', 'phone', 'attributes', 'createdAt', 'updatedAt']
		});

		for (const user of users) {
			if(user.roles) user.roles = await req.context.models.UserRole.findRoles(user.roles);
		}

		code = 200;
		message = {
			_meta: {
				total: users.length
			},
			results: users
		};
	} catch (e) {
		console.error(e);
		code = 500;
	}

	return utils.response(res, code, message);
});

// Gets a specific user.
router.get('/:email', utils.authMiddleware, async (req, res) => {
	let code;
	let message;
	try {
		if (validator.isEmail(req.params.email)) {
			const user = await req.context.models.User.findOne({
				where: {
					email: req.params.email.toLowerCase()
				},
				attributes: ['id', 'email', 'roles', 'displayName', 'phone', 'createdAt', 'updatedAt']
			});
			if (user) {
				if (user.roles) user.roles = await req.context.models.UserRole.findRoles(user.roles);
				/** @todo add contact info for users */
				// user.dataValues.contact = await req.context.models.Contact.findByUserId(user.id);
			} else {
				return utils.response(res, 422);
			}

			code = 200;
			message = user;
		} else {
			code = 422;
		}
	} catch (e) {
		console.error(e);
		code = 500;
	}

	return utils.response(res, code, message);
});

// Creates a new user. ONLY if we're in dev
if (process.env.NODE_ENV === 'development') {
	router.post('/', async (req, res) => {
		let code;
		let message;
		try {
			if (validator.isEmail(req.body.email)) {
				const { email, password, roles } = req.body;
				const user = await req.context.models.User.create({ email: email.toLowerCase(), password, roles });
	
				code = 200;
				message = user.email + ' created';
			} else {
				code = 422;
			}
		} catch (e) {
			console.error(e);
			code = 500;
		}
	
		return utils.response(res, code, message);
	});
}

// Updates any user.
router.put('/', utils.authMiddleware, async (req, res) => {
	let code;
	let message;
	try {
		if (validator.isEmail(req.body.email)) {
			/** @todo add email and phone update options */
			const { email, password } = req.body;
			const user = await req.context.models.User.findOne({
				where: {
					email: email.toLowerCase()
				}
			});
			user.password = password;
			await user.save();

			code = 200;
			message = user.email + ' updated';
		} else {
			code = 422;
		}
	} catch (e) {
		console.error(e);
		code = 500;
	}

	return utils.response(res, code, message);
});

// Deletes a user.
router.delete('/:email', utils.authMiddleware, async (req, res) => {
	let code;
	let message;
	try {
		if (validator.isEmail(req.params.email)) {
			const user = await req.context.models.User.findOne({
				where: {
					email: req.params.email.toLowerCase()
				}
			});
			await user.destroy();

			code = 200;
			message = req.params.email + ' deleted';
		} else {
			code = 422;
		} 
	} catch (e) {
		console.error(e);
		code = 500;
	}

	return utils.response(res, code, message);
});

export default router;
