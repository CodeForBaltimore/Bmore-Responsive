import { Router } from 'express';
// import validator from 'validator';
import utils from '../utils';

const router = new Router();

// Gets all entities.
router.get('/', async (req, res) => {
	try {
		if (await utils.validateToken(req, res)) {
			const entities = await req.context.models.Entity.findAll({
			});

			return res.send({
				_meta: {
					total: entities.length
				},
				results: entities
			});
		}

		throw new Error('Invalid input');
	} catch {
		res.status(400).send('Invalid input');
	}
});

// Gets a specific entity.
router.get('/:entity_id', async (req, res) => {
	try {
		if (await utils.validateToken(req, res)) {
			const entity = await req.context.models.Entity.findOne({
				where: {
					id: req.params.entity_id
				}
			});
			entity.dataValues.contacts = []

			const contacts = await req.context.models.Entity.findContacts(req.params.entity_id);

			for (let contact of contacts) {
				entity.dataValues.contacts.push({
					id: contact.dataValues.id,
					name: contact.dataValues.name,
				});
			}

			console.log(entity)

			return res.send(entity);
		}

		throw new Error('Invalid input');
	} catch (e) {
		console.error(e);
		res.status(400).send('Invalid payload');
	}
});

// Creates a new entity.
router.post('/', async (req, res) => {
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
				return res.send(entity.id + ' created');
			}
		}

		throw new Error('Invalid input');
	} catch (e) {
		console.error(e);
		return res.status(400).send('Invalid input');
	}
});

// Updates any entity.
router.put('/', async (req, res) => {
	try {
		if (await utils.validateToken(req, res)) {
			let { id, name, phone, email, checkIn } = req.body;

			/** @todo validate emails */
			// Validating emails 
			// if (await !utils.validateEmails(email)) res.status(400).send('Invalid input');

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
			return res.send(entity.id + ' updated');
		}

		throw new Error('Invalid input');
	} catch (e) {
		console.error(e);
		res.status(400).send('Invalid input');
	}
});

// Deletes a entity.
router.delete('/:entity_id', async (req, res) => {
	try {
		if (await utils.validateToken(req, res)) {
			const entity = await req.context.models.Entity.findOne({
				where: {
					id: req.params.entity_id
				}
			});
			await entity.destroy();
			return res.send(req.params.entity_id + ' deleted');
		}
		throw new Error('Invalid input');
	} catch (e) {
		console.error(e);
		res.status(400).send('Invalid input');
	}
});

export default router;
