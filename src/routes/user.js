import {Router} from 'express';
import services from '../services';

const router = Router();

router.get('/', async (req, res) => {
	return res.send(await services.user.getAll(req));
});

router.get('/:userId', async (req, res) => {
	return res.send(await services.user.getUser(req));
});

export default router;
