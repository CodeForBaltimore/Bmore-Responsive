import {Router} from 'express';

const router = Router();
const validateToken = async (req, res) => {
	if (await req.context.models.User.validateToken(req.headers.token) || process.env.BYPASS_LOGIN) return true;
	return res.status(401).send("Unauthorized");
}

router.get('/', async (req, res) => {
	try {
		if (await validateToken(req, res)) {
			const users = await req.context.models.User.findAll({
				attributes: ['username']
			});
	
			return res.send(users);
		}
	} catch (e) {
		res.status(500).send(e);
	}
});

router.get('/:username', async (req, res) => {
	try {
		if (await validateToken(req, res)) {
			const user = await req.context.models.User.findOne({
				where: {
					username: req.params.username
				},
				attributes: ['username','token','createdAt','updatedAt']
			});
			
			return res.send(user);
		}
	} catch (e) {
		return res.status(400).send("Invalid payload");
 	}
});

router.post('/login', async (req, res) => {
	try {
		const { username, password } = req.body;
		
		const token = await req.context.models.User.findByLogin(username,password);

		if (token.length > 0) return res.send(token);
	} catch (e) {
		return res.status(400).send("Invalid input");
	}
})

router.post('/', async (req, res) =>{
	try{
		if (await validateToken(req, res)) {
			const {username, password} = req.body;

			const user = await req.context.models.User.create({username: username, password: password});
			return res.send(user.username + " created");
		}
	} catch(e){
		return res.status(400).send("Invalid input");
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
		return res.send(user.username + " updated");
	} catch(e){
		return res.status(400).send("Invalid input");
	}
})

router.delete('/', async (req, res) =>{
	try{
		if (await validateToken(req, res)) {
			const {username} = req.body;

			const user = await req.context.models.User.findOne({
				where: {
					username: username
				}
			});
			await user.destroy();
			return res.send(username + " deleted");
		}
	} catch(e){
		return res.status(400).send("Invalid input");
	}
})

export default router;
