import {Router} from 'express';
import validator from 'validator';
import utils from '../utils';

const router = new Router();

// Gets all contacts.
router.get('/', async (req, res) => {
	try {
		if (await utils.validateToken(req, res)) {
			const contacts = await req.context.models.User.findAll({
				attributes: ['email', 'displayName', 'phone', 'createdAt', 'updatedAt']
			});
			return res.send(users);
		}

		throw new Error('Invalid input');
	} catch {
		res.status(400).send('Invalid input');
	}
});

// Gets a specific contact.
router.get('/:email', async (req, res) => {
	try {
		if (validator.isEmail(req.params.email) && await utils.validateToken(req, res)) {
			const user = await req.context.models.User.findOne({
				where: {
					email: req.params.email
				},
				attributes: ['email', 'displayName', 'phone', 'createdAt', 'updatedAt']
			});
			return res.send(user);
		}

		throw new Error('Invalid input');
	} catch {
		res.status(400).send('Invalid payload');
	}
});

// Creates a new contact.
router.post('/', async (req, res) => {
	try {
		if (validator.isMobilePhone(req.body.phone)) {
			const { name, phone } = req.body;
			const contact = await req.context.models.Contact.create({name, phone});
			return res.send(contact.name + ' created');
		}

		throw new Error('Invalid input');
	} catch {
		return res.status(400).send('Invalid input');
	}
});

// Updates any contact.
router.put('/', async (req, res) => {
	try {
		if (validator.isMobilePhone(req.body.phone) && await utils.validateToken(req, res)) {
            console.log('yeeto');
			const {name, phone, email} = req.body;
			const contact = await req.context.models.Contact.findOne({
				where: {
					phone
				}
            });
            contact.name = name;
            contact.phone = phone;
            contact.email = email;

			await contact.save();
			return res.send(contact.name + ' updated');
        }

		throw new Error('Invalid input');
	} catch {
		res.status(400).send('Invalid input');
	}
});

// Deletes a contact.
router.delete('/:phone', async (req, res) => {
	try {
		if (validator.isMobilePhone(req.params.phone) && await utils.validateToken(req, res)) {
			const user = await req.context.models.User.findOne({
				where: {
					email: req.params.email
				}
			});
			await user.destroy();
			return res.send(req.params.email + ' deleted');
		}

		throw new Error('Invalid input');
	} catch {
		res.status(400).send('Invalid input');
	}
});

// Deletes a user.
router.delete('/:phone', async (req, res) => {
	try {
		if (validator.isMobilePhone(req.params.phone) && await utils.validateToken(req, res)) {
			const user = await req.context.models.User.findOne({
				where: {
					email: req.params.email
				}
			});
			await user.destroy();
			return res.send(req.params.phone + ' deleted');
		}

		throw new Error('Invalid input');
	} catch {
		res.status(400).send('Invalid input');
	}
});

export default router;
