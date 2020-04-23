import { Router } from 'express';
import validator from 'validator';
import utils from '../utils';

const router = new Router();
router.use(utils.authMiddleware)

// Gets all contacts.
router.get('/', async (req, res) => {
	let code;
	let message;
	try {
		const contacts = await req.context.models.Contact.findAll({
		});

		code = 200;
		message = {
			_meta: {
				total: contacts.length
			},
			results: contacts
		};
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
		if (validator.isUUID(req.params.contact_id)) {
			const contact = await req.context.models.Contact.findOne({
				where: {
					id: req.params.contact_id
				},
			});

			code = 200;
			message = contact;

			//get all entities associated with the particular contact
			const contactEntities = await req.context.EntityContact.findAll({

			})
		} else {
			code = 422;
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
		if (req.body.name !== undefined) {
			const { name, phone, email, UserId, EntityId } = req.body;

			// Validating emails 
			if (email) {
				const goodEmail = await utils.validateEmails(email);
				if (!goodEmail) return utils.response(res, 422);
			}
			
			const contact = await req.context.models.Contact.create({ name, email, phone, UserId, EntityId });

			code = 200;
			message = contact.id + ' created';
		} else {
			code = 422;
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
		if (validator.isUUID(req.body.id)) {
			const { id, name, phone, email, UserId, EntityId } = req.body;

			// Validating emails 
			if (email) {
				const goodEmail = await utils.validateEmails(email);
				if (!goodEmail) return utils.response(res, 422);
			}

			const contact = await req.context.models.Contact.findOne({
				where: {
					id: id
				}
			});

			if (!contact) return utils.response(res, 400, message);

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
			code = 422;
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
			code = 422;
		}
	} catch (e) {
		console.error(e);
		code = 500;
	}

	return utils.response(res, code, message);
});

// links contact with list of entities
router.post('/link/:contact_id', async (req, res) => {
	//todo lots of validation to validate what is passed to the endpoint
	//todo util function to check if relationship already exists?
	let code;
	let message;
	try {
		const contact = await req.context.models.Contact.findOne({
			where: {
				id: req.params.contact_id
			}
		});

		for(entity in req.body.entities) {
			const entityToLink = await req.context.models.Entity.findOne({
				id: entity.id
			});

			const ec = {
				entityId: entityToLink.id,
				contactId: contact.id,
				relationshipTitle: entity.title
			};

			const savedProductOrder = await req.context.models.EntityContact.create(ec);
		}

		message = `Link successful for contact with ID ${contact.id}`;
		code = 200;
	} catch (e) {
		console.error(e);
		code = 500;
	}

	return utils.response(res, code, message);
});

export default router;
