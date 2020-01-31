import {Router} from 'express';

const router = Router();

/**
 * Validates a user login token.
 *
 * This validates a user token. If the token is invalid the request will immediately be rejected back with a 401.
 *
 * @param {*} req The request object.
 * @param {*} res The response object.
 *
 * @return {Boolean}
 */
const validateToken = async (req, res) => {
	if (await req.context.models.User.validateToken(req.headers.token) || process.env.BYPASS_LOGIN) {
		return true;
	}

	return res.status(401).send('Unauthorized');
};

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
		if (await validateToken(req, res)) {
			const users = await req.context.models.User.findAll({
				attributes: ['username', 'email', 'phone']
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
		if (await validateToken(req, res)) {
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
		if (await validateToken(req, res)) {
			const {username, password} = req.body;

			const user = await req.context.models.User.create({username, password});
			return res.send(user.username + ' created');
		}
	} catch {
		return res.status(400).send('Invalid input');
	}
});

// Updates a user.
router.put('/', async (req, res) => {
	try {
		/** @todo add email and phone update options */
		const {username, password} = req.body;

		const user = await req.context.models.User.findOne({
			where: {
				username
			}
		});

		console.log(password);
		user.password = password;
		console.log(user);
		await user.save();
		return res.send(user.username + ' updated');
	} catch {
		return res.status(400).send('Invalid input');
	}
});

// Deletes a user.
router.delete('/', async (req, res) => {
	try {
		if (await validateToken(req, res)) {
			const {username} = req.body;

			const user = await req.context.models.User.findOne({
				where: {
					username
				}
			});
			await user.destroy();
			return res.send(username + ' deleted');
		}
	} catch {
		return res.status(400).send('Invalid input');
	}
});

export default router;
