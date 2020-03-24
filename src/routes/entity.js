import { Router } from 'express';
// import validator from 'validator';
import utils from '../utils';

const router = new Router();

// Gets all entities.
router.get('/', async (req, res) => {
	let code;
	let message;
	try {
		if (await utils.validateToken(req, res)) {
			const entities = await req.context.models.Entity.findAll({
			});

			for (let entity of entities) {
				entity.dataValues.contacts = []

				const contacts = await req.context.models.Entity.findContacts(entity.id);

				if (contacts) {
					for (let contact of contacts) {
						entity.dataValues.contacts.push({
							id: contact.dataValues.id,
							name: contact.dataValues.name,
						});
					}
				}
			}

			code = 200;
			message = {
				_meta: {
					total: entities.length
				},
				results: entities
			};
		} else {
			code = 401;
		}
	} catch (e) {
		console.error(e);
		code = 500;
	}

	return utils.response(res, code, message);
});

// Gets a specific entity.
router.get('/:entity_id', async (req, res) => {
	let code;
	let message;
	try {
		if (await utils.validateToken(req, res)) {
			const entity = await req.context.models.Entity.findOne({
				where: {
					id: req.params.entity_id
				}
			});
			entity.dataValues.contacts = [];

			const contacts = await req.context.models.Entity.findContacts(req.params.entity_id);

			if (contacts) {
				for (let contact of contacts) {
					entity.dataValues.contacts.push({
						id: contact.dataValues.id,
						name: contact.dataValues.name,
					});
				}
			}

			code = 200;
			message = entity;
		} else {
			code = 401;
		}
	} catch (e) {
		console.error(e);
		code = 500;
	}

	return utils.response(res, code, message);
});

// Creates a new entity.
router.post('/', async (req, res) => {
	let code;
	let message;
	try {
		if (await utils.validateToken(req, res)) {
			if (req.body.name !== undefined) {
				let { name, phone, email, checkIn } = req.body;

				if (!checkIn) {
					checkIn = {
						_meta: {
							total: 0
						},
						checkIns: []
					}
				}

				const entity = await req.context.models.Entity.create({ name, email, phone, checkIn });

				code = 200;
				message = entity.id + ' created';
			}
		} else {
			code = 401;
		}
	} catch (e) {
		console.error(e);
		code = 500;
	}

	return utils.response(res, code, message);
});

// Updates any entity.
router.put('/', async (req, res) => {
	let code;
	let message;
	try {
		if (await utils.validateToken(req, res)) {
			let { id, name, phone, email, checkIn } = req.body;

			/** @todo validate emails */
			// Validating emails 
			// if (await !utils.validateEmails(email)) res.status(500).send('Server error');

			let entity = await req.context.models.Entity.findOne({
				where: {
					id: id
				}
			});

			entity.name = (name) ? name : entity.name;
			entity.phone = (phone) ? phone : entity.phone;
			entity.email = (email) ? email : entity.email;
			/** @todo validate checkIn JSON */
			if (entity.checkIn === null && checkIn) {
				const checkIns = {
					_meta: {
						total: 1
					},
					checkIns: [
						checkIn
					]
				}

				entity.checkIn = checkIns;
			} else if (entity.checkIn !== null && checkIn) {
				let checkIns = entity.checkIn.checkIns;
				checkIns.push(checkIn);
				let total = entity.checkIn._meta.total + 1

				const update = {
					_meta: {
						total: total
					},
					checkIns: checkIns
				}

				entity.checkIn = update;
			}

			entity.updatedAt = new Date();

			await entity.save();

			code = 200;
			message = entity.id + ' updated';
		} else {
			code = 401;
		}
	} catch (e) {
		console.error(e);
		code = 500;
	}

	return utils.response(res, code, message);
});

// Deletes a entity.
router.delete('/:entity_id', async (req, res) => {
	let code;
	let message;
	try {
		if (await utils.validateToken(req, res)) {
			const entity = await req.context.models.Entity.findOne({
				where: {
					id: req.params.entity_id
				}
			});
			await entity.destroy();

			code = 200;
			message = req.params.entity_id + ' deleted';
		} else {
			code = 401;
		}
	} catch (e) {
		console.error(e);
		code = 500;
	}

	return utils.response(res, code, message);
});

export default router;
