import {Router} from 'express';

const router = Router();

router.get('/', async (req, res) => {
	try {
		const users = await req.context.models.User.findAll({
			attributes: ['username']
		});

		return res.send(users);
	} catch (e) {
		res.status(500).send(e);
	}
});

router.get('/:userId', async (req, res) => {
	try {
		const user = await req.context.models.User.findOne({
			where: {
				id: req.params.userId
			},
			attributes: ['username','token','createdAt','updatedAt']
		});

		return res.send(user);
	} catch (e) {
	 res.status(500).send(e);
 	}
});

router.post('/login', async (req, res) => {
	try {
		const { username, password } = req.body;
		
		const response = await req.context.models.User.findByLogin(username,password);
		console.log(response);

		res.send(response);
	} catch (e) {
		res.status(500).send(e);
	}
})

router.post('/', async (req, res) =>{
	try{
		const {username, password} = req.body;

		const user = await req.context.models.User.create({username: username, password: password});
		res.send(user.username + " created");
	} catch(e){
		res.status(500).send(e);
	}
})

router.put('/', async (req, res) =>{
	try{
		const {username, password} = req.body;

		const user = await req.context.models.User.findOne({
			where: {
				username: username
			}
		});

		console.log(password);
		user.password = password;
		console.log(user);
		await user.save();
		res.send(user.username + " updated");
	} catch(e){
		res.status(500).send(e);
	}
})

router.delete('/', async (req, res) =>{
	try{
		const {username} = req.body;

		const user = await req.context.models.User.findOne({
			where: {
				username: username
			}
		});
		await user.destroy();
		res.send(username + " deleted");
	} catch(e){
		res.status(500).send(e);
	}
})

export default router;
