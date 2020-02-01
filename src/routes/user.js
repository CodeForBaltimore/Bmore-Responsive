import {Router} from 'express';

const router = Router();

router.get('/', async (req, res) => {
	try {
		const users = await req.context.models.User.findAll({
			attributes: ['id','username','createdAt','updatedAt']
		});

		return res.send(users);
	} catch (e) {
		res.status(400).send(e);
	}
});

router.get('/:userId', async (req, res) => {
	try {
		const user = await req.context.models.User.findOne({
			where: {
				id: req.params.userId
			},
			attributes: ['id','username','token','createdAt','updatedAt']
		});

		return res.send(user);
	} catch (e) {
	 res.status(400).send(e);
 	}
});

router.post('/login', async (req, res) => {
	try {
		const { username, password } = req.body;
		
		const response = await req.context.models.User.findByLogin(username,password);
		console.log(response);

		res.send(response);
	} catch (e) {
		res.status(400).send(e);
	}
})

export default router;
