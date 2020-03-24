import { Router } from 'express';
import validator from 'validator';
import utils from '../utils';

const router = new Router();

// Gets all contacts.
router.get('/', async (req, res) => {
	let code;
	let message;
	try {
		if (await utils.validateToken(req)) {
			const contacts = await req.context.models.Contact.findAll({
			});

			code = 200;
			message = {
				_meta: {
					total: contacts.length
				},
				results: contacts
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

// Gets a specific contact.
router.get('/:contact_id', async (req, res) => {
	let code;
	let message;
	try {
		if (await utils.validateToken(req)) {
			if (validator.isUUID(req.params.contact_id)) {
				const contact = await req.context.models.Contact.findOne({
					where: {
						id: req.params.contact_id
					},
				});

				code = 200;
				message = contact;
			} else {
				code = 400;
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

// Creates a new contact.
router.post('/', async (req, res) => {
	let code;
	let message;
	try {
		if (await utils.validateToken(req)) {
			if (req.body.name !== undefined) {
				console.log('test')
				const { name, phone, email, UserId, EntityId } = req.body;
				const contact = await req.context.models.Contact.create({ name, email, phone, UserId, EntityId });

				code = 200;
				message = contact.id + ' created';
			} else {
				code = 400;
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

// Updates any contact.
router.put('/', async (req, res) => {
	let code;
	let message;
	try {
		if (await utils.validateToken(req)) {
			if (validator.isUUID(req.body.id)) {
				const { id, name, phone, email, UserId, EntityId } = req.body;

				/** @todo validate emails */
				// Validating emails 
				// if (await !utils.validateEmails(email)) res.status(500).send('Server error');

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

				code = 200;
				message = contact.id + ' updated';
			} else {
				code = 400;
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

// Deletes a contact.
router.delete('/:contact_id', async (req, res) => {
	let code;
	let message;
	try {
		if (await utils.validateToken(req, res)) {
			if (validator.isUUID(req.params.contact_id)) {
				const contact = await req.context.models.Contact.findOne({
					where: {
						id: req.params.contact_id
					}
				});
				await contact.destroy();

				code = 200;
				message = req.params.contact_id + ' deleted';
			} else {
				code = 400;
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

export default router;
