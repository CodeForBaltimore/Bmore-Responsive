import { Router } from 'express';
import validator from 'validator';
import utils from '../utils';

const router = new Router();

// Gets all entities.
router.get('/', async (req, res) => {
	try {
		if (await utils.validateToken(req, res)) {
			const entities = await req.context.models.Entity.findAll({
				attributes: ['id', 'name', 'updatedAt']
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
				},
				attributes: ['id', 'name', 'email', 'phone', 'createdAt', 'updatedAt']
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
				const { name, phone, email } = req.body;
				console.log(email)

				const entity = await req.context.models.Entity.create({ name, email, phone });
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
			const { id, name, phone, email } = req.body;

			/** @todo validate emails */
			// Validating emails 
			// if (await !utils.validateEmails(email)) res.status(400).send('Invalid input');
			
			const entity = await req.context.models.Entity.findOne({
				where: {
					id: id
				}
			});
			
			entity.name = name;
			entity.phone = phone;
			entity.email = email;
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
	} catch {
		res.status(400).send('Invalid input');
	}
});

export default router;
