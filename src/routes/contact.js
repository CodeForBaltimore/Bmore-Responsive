import { Router } from 'express';
import validator from 'validator';
import utils from '../utils';

const router = new Router();

// Gets all contacts.
router.get('/', async (req, res) => {
	try {
		if (await utils.validateToken(req, res)) {
			const contacts = await req.context.models.Contact.findAll({
				// attributes: ['id', 'name', 'updatedAt']
			});
			return res.send({
				_meta: {
					total: contacts.length
				},
				results: contacts
			});
		}

		throw new Error('Invalid input');
	} catch {
		res.status(400).send('Invalid input');
	}
});

// Gets a specific contact.
router.get('/:contact_id', async (req, res) => {
	try {
		if (await utils.validateToken(req, res)) {
			const contact = await req.context.models.Contact.findOne({
				where: {
					id: req.params.contact_id
				},
				// attributes: ['id', 'name', 'email', 'phone', 'UserId', 'createdAt', 'updatedAt']
			});
			return res.send(contact);
		}

		throw new Error('Invalid input');
	} catch {
		res.status(400).send('Invalid payload');
	}
});

// Creates a new contact.
router.post('/', async (req, res) => {
	try {
		if (await utils.validateToken(req, res)) {
			if (req.body.name !== undefined) {
				const { name, phone, email, UserId, EntityId } = req.body;
				const contact = await req.context.models.Contact.create({ name, email, phone, UserId, EntityId });
				return res.send(contact.id + ' created');
			}
		}

		throw new Error('Invalid input');
	} catch (e) {
		console.error(e);
		return res.status(400).send('Invalid input');
	}
});

// Updates any contact.
router.put('/', async (req, res) => {
	try {
		if (await utils.validateToken(req, res)) {
			const { id, name, phone, email, UserId, EntityId } = req.body;

			/** @todo validate emails */
			// Validating emails 
			// if (await !utils.validateEmails(email)) res.status(400).send('Invalid input');

			const contact = await req.context.models.Contact.findOne({
				where: {
					id: id
				}
			});

			contact.name = (name) ? name : contact.name;
			contact.phone = (phone) ? phone : contact.phone;
			contact.email = (email) ? email : contact.email;
			contact.UserId = (UserId) ? UserId : contact.UserId;
			contact.EntityId = (EntityId) ? EntityId : contact.EntityId;
			contact.updatedAt = new Date();

			await contact.save();
			return res.send(contact.id + ' updated');
		}

		throw new Error('Invalid input');
	} catch (e) {
		console.error(e);
		res.status(400).send('Invalid input');
	}
});

// Deletes a contact.
router.delete('/:contact_id', async (req, res) => {
	try {
		if (await utils.validateToken(req, res)) {
			const contact = await req.context.models.Contact.findOne({
				where: {
					id: req.params.contact_id
				}
			});
			await contact.destroy();
			return res.send(req.params.contact_id + ' deleted');
		}
		throw new Error('Invalid input');
	} catch (e) {
		console.error(e);
		res.status(400).send('Invalid input');
	}
});

export default router;
