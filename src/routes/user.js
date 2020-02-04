import {Router} from 'express';
import validator from 'validator';
import utils from '../utils';

const router = Router();

// User login.
router.post('/login', async (req, res) => {
	try {
		const {email, password} = req.body;

		if(validator.isEmail(email)) {
			const token = await req.context.models.User.findByLogin(email, password);

			if (token.length > 0) {
				return res.send(token);
			}
		}

		throw 'Invalid input';
	} catch {
		res.status(400).send('Invalid input');
	}
});

// Gets all users.
router.get('/', async (req, res) => {
	try {
		if (await utils.validateToken(req, res)) {
			const users = await req.context.models.User.findAll({
				attributes: ['email', 'displayName', 'phone', 'createdAt', 'updatedAt']
			});

			return res.send(users);
		}

		throw 'Invalid input';
	} catch {
		res.status(400).send('Invalid input');
	}
});

// Gets a specific user.
router.get('/:email', async (req, res) => {
	try {
		if (validator.isEmail(req.params.email) && await utils.validateToken(req, res)) {
			const user = await req.context.models.User.findOne({
				where: {
					email: req.params.email
				},
				attributes: ['email', 'displayName', 'phone', 'createdAt', 'updatedAt']
			});

			return res.send(user);
		}

		throw 'Invalid input';
	} catch {
		res.status(400).send('Invalid payload');
	}
});

// Creates a new user.
router.post('/', async (req, res) => {
	try {
		if(validator.isEmail(req.body.email)) {
			const {email, password} = req.body;

			const user = await req.context.models.User.create({email, password});
			return res.send(user.email + ' created');
		} 

		throw 'Invalid input';
	} catch {
		return res.status(400).send('Invalid input');
	}
});

// Updates any user.
router.put('/', async (req, res) => {
	try {
		if (validator.isEmail(req.body.email) && await utils.validateToken(req, res)) {
			/** @todo add email and phone update options */
			const {email, password} = req.body;

			const user = await req.context.models.User.findOne({
				where: {
					email
				}
			});

			user.password = password;
			await user.save();

			return res.send(user.email + ' updated');
		}

		throw 'Invalid input';
	} catch {
		res.status(400).send('Invalid input');
	}
});

// Deletes a user.
router.delete('/:email', async (req, res) => {
	try {
		if (validator.isEmail(req.params.email) && await utils.validateToken(req, res)) {
			const user = await req.context.models.User.findOne({
				where: {
					email: req.params.email
				}
			});
			await user.destroy();
			return res.send(req.params.email + ' deleted');
		}

		throw 'Invalid input';
	} catch {
		res.status(400).send('Invalid input');
	}
});

export default router;
