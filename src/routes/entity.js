import { Router } from 'express';
import validator from 'validator';
import utils from '../utils';

const router = new Router();
router.use(utils.authMiddleware);

// Gets all entities.
router.get('/', async (req, res) => {
	let code;
	let message;
	try {
		const entities = await req.context.models.Entity.findAll();

		code = 200;
		message = {
			_meta: {
				total: entities.length
			},
			results: entities
		};
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
		if (validator.isUUID(req.params.entity_id)) {
			const entity = await req.context.models.Entity.findEntityWithAssociatedContacts(req.params.entity_id);

			code = 200;
			message = entity;
		} else {
			code = 422;
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
	let ec;
	try {
		if (req.body.name !== undefined) {
			let { name, address, phone, email, checkIn, contacts } = req.body;

			if (!checkIn) {
				checkIn = {
					_meta: {
						total: 0
					},
					checkIns: []
				}
			}

			const entity = await req.context.models.Entity.create({ name, address, email, phone, checkIn });
			if (contacts) {
				for(const contact of contacts) {
					ec = {
						entityId: entity.id,
						contactId: contact.id
					}
					if (contact.title) {
						ec.relationshipTitle = contact.title;
					}
					await req.context.models.EntityContact.createIfNew(ec);
				}
			}

			code = 200;
			message = entity.id + ' created';
		} else {
			code = 422;
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
	let ec;
	try {
		if (validator.isUUID(req.body.id)) {
			let { id, name, address, phone, email, checkIn, contacts } = req.body;

			/** @todo validate emails */
			// Validating emails 
			// if (await !utils.validateEmails(email)) res.status(500).send('Server error');

			let entity = await req.context.models.Entity.findOne({
				where: {
					id: id
				}
			});

			entity.name = (name) ? name : entity.name;
			entity.address = (address) ? address : entity.address;
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

			if (contacts) {
				for(const contact of contacts) {
					ec = {
						entityId: entity.id,
						contactId: contact.id
					}
					if (contact.title) {
						ec.relationshipTitle = contact.title;
					}
					await req.context.models.EntityContact.createIfNew(ec);
				}
			}

			code = 200;
			message = entity.id + ' updated';
		} else {
			code = 422;
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
		if (validator.isUUID(req.params.entity_id)) {
			const entity = await req.context.models.Entity.findOne({
				where: {
					id: req.params.entity_id
				}
			});
			await entity.destroy();

			code = 200;
			message = req.params.entity_id + ' deleted';
		} else {
			code = 422;
		}
	} catch (e) {
		console.error(e);
		code = 500;
	}

	return utils.response(res, code, message);
});

// links entity with list of contacts
router.post('/link/:entity_id', async (req, res) => {
	let code;
	let message;
	try {
		if (validator.isUUID(req.params.entity_id)) {
			const entity = await req.context.models.Entity.findOne({
				where: {
					id: req.params.entity_id
				}
			});
			for(const contact of req.body.contacts) {
				const contactToLink = await req.context.models.Contact.findOne({
					where: {
						id: contact.id
					}
				});



				const ec = {
					entityId: entity.id,
					contactId: contactToLink.id
				};

				if (contact.title) {
					ec.relationshipTitle = contact.title;
				}

				await req.context.models.EntityContact.createIfNew(ec);
			}
			message = `Link successful/already exists for entity with ID ${entity.id}`;
			code = 200;
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
