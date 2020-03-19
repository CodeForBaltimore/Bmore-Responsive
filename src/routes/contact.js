import { Router } from 'express';
import validator from 'validator';
import utils from '../utils';

const router = new Router();

// Gets all contacts.
router.get('/', async (req, res) => {
	try {
		if (await utils.validateToken(req, res)) {
			const contacts = await req.context.models.Contact.findAll({
				attributes: ['email', 'name', 'phone', 'createdAt', 'updatedAt']
			});
			return res.send(contacts);
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
				attributes: ['email', 'name', 'phone', 'createdAt', 'updatedAt']
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
		if (req.body.name !== undefined) {
			const { name, phone, email } = req.body;
			const contact = await req.context.models.Contact.create({ name, email, phone });
			return res.send(contact.name + ' created');
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
			const { id, name, phone, email } = req.body;
			const contact = await req.context.models.Contact.findOne({
				where: {
					id: id
				}
			});
			contact.name = name;
			contact.phone = phone;
			contact.email = email;

			await contact.save();
			return res.send(contact.id + ' updated');
		}

		throw new Error('Invalid input');
	} catch {
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
	} catch {
		res.status(400).send('Invalid input');
	}
});

export default router;
