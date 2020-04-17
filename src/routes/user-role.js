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
		const roles = await req.context.models.UserRole.findAll({
		});

		code = 200;
		message = roles;
	} catch (e) {
		console.error(e);
		code = 500;
	}

	return utils.response(res, code, message);
});

// Gets a specific role.
router.get('/:role_id', async (req, res) => {
	let code;
	let message;
	try {
		const role = await req.context.models.UserRole.findOne({
			where: {
				id: req.params.role_id
			}
		});

		code = 200;
		message = role;
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
		const { role, description } = req.body;
		const newRole = await req.context.models.UserRole.create({ role, description });
		code = 200;
		message = newRole.role + ' created';
	} catch (e) {
		console.error(e);
		code = 500;
	}

	return utils.response(res, code, message);
});

// Updates any role.
router.put('/', async (req, res) => {
	let code;
	let message;
	try {
		const { id, role, description } = req.body;
		if (validator.isNumeric(id.toString())) {
			const updatedRole = await req.context.models.UserRole.findOne({
				where: {
					id
				}
			});
			updatedRole.role = role;
			updatedRole.description = description;
			await updatedRole.save();

			code = 200;
			message = updatedRole.role + ' updated';
		} else {
			code = 400;
		}
	} catch (e) {
		console.error(e);
		code = 500;
	}

	return utils.response(res, code, message);
});

// Deletes a role.
router.delete('/:role_id', async (req, res) => {
	let code;
	let message;
	try {
		const role = await req.context.models.UserRole.findOne({
			where: {
				id: req.params.role_id
			}
		});
		const name = (role) ? role.role : '';
		await role.destroy();

		code = 200;
		message = name + ' deleted';
	} catch (e) {
		console.error(e);
		code = 500;
	}

	return utils.response(res, code, message);
});

export default router;
