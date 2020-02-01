import {Router} from 'express';
import utils from '../utils';

const router = Router();

// User login.
router.post('/login', async (req, res) => {
	try {
		const {username, password} = req.body;

		const token = await req.context.models.User.findByLogin(username, password);

		if (token.length > 0) {
			return res.send(token);
		}
	} catch {
		return res.status(400).send('Invalid input');
	}
});

// Gets all users.
router.get('/', async (req, res) => {
	try {
		if (await utils.validateToken(req, res)) {
			const users = await req.context.models.User.findAll({
				attributes: ['username', 'email', 'phone', 'createdAt', 'updatedAt']
			});

			return res.send(users);
		}
	} catch (error) {
		res.status(500).send(error);
	}
});

// Gets a specific user.
router.get('/:username', async (req, res) => {
	try {
		if (await utils.validateToken(req, res)) {
			const user = await req.context.models.User.findOne({
				where: {
					username: req.params.username
				},
				attributes: ['username', 'email', 'phone', 'createdAt', 'updatedAt']
			});

			return res.send(user);
		}
	} catch {
		return res.status(400).send('Invalid payload');
	}
});

// Creates a new user.
router.post('/', async (req, res) => {
	try {
		if (await utils.validateToken(req, res)) {
			const {username, password} = req.body;

			const user = await req.context.models.User.create({username, password});
			return res.send(user.username + ' created');
		}
	} catch {
		return res.status(400).send('Invalid input');
	}
});

// Updates any user.
router.put('/', async (req, res) => {
	try {
		/** @todo add email and phone update options */
		const {username, password} = req.body;

		const user = await req.context.models.User.findOne({
			where: {
				username
			}
		});

		user.password = password;
		await user.save();

		return res.send(user.username + ' updated');
	} catch {
		return res.status(400).send('Invalid input');
	}
});

// Deletes a user.
router.delete('/:username', async (req, res) => {
	try {
		if (await utils.validateToken(req, res)) {
			console.log(req.params.username)
			const user = await req.context.models.User.findOne({
				where: {
					username: req.params.username
				}
			});
			await user.destroy();
			return res.send(req.params.username + ' deleted');
		}
	} catch {
		return res.status(400).send('Invalid input');
	}
});

export default router;
