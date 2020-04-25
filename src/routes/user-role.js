import { Router } from 'express';
import validator from 'validator';
import utils from '../utils';

const router = new Router();
router.use(utils.authMiddleware)

// Gets all roles.
router.get('/', async (req, res) => {
	let code;
	let message;
	try {
		const e = await utils.loadCasbin();
		const rolesRaw = await e.getNamedPolicy('p');
		const roles = {};


		for (const role of rolesRaw) {
			if (roles[role[0]] !== undefined) {
				roles[role[0]].push({
					path: role[1],
					method: role[2]
				})
			} else {
				roles[role[0]] = [{
					path: role[1],
					method: role[2]
				}];
			}
		}

		code = 200;
		message = roles;
	} catch (e) {
		console.error(e);
		code = 500;
	}

	return utils.response(res, code, message);
});

// Creates a new role.
router.post('/', async (req, res) => {
	let code;
	let message;
	try {
		const { role, path, method } = req.body;

		if (role && path && method) {
			let added = false;
			
			const e = await utils.loadCasbin();
			const p = [role, path, method]
			added = await e.addPolicy(...p)

			if (added) {
				code = 200;
				message = 'policy created';
			} else {
				code = 422;
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

// Deletes a role.
router.post('/delete', async (req, res) => {
	let code;
	let message;
	try {
		const e = await utils.loadCasbin();
		const { role, path, method } = req.body;

		const p = [role, path, method]
		const removed = await e.removePolicy(...p)

		if (removed) {
			code = 200;
			message = 'policy deleted';
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
