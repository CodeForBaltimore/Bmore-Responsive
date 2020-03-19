import { Router } from 'express';
import validator from 'validator';
import utils from '../utils';
import controller from '../controllers/user';

const router = new Router();

// User login.
router.post('/login', async (req, res) => {
  try {
    const token = await controller.login(req.body);
    if (token !== false) {
      return res.send(token);
    }
  } catch (e) {
    console.error(e);
  }
  res.status(400).send('Invalid input');
});

// Gets all users.
router.get('/', async (req, res) => {
  try {
    if (await utils.validateToken(req.headers.token)) {
      return res.send(await controller.getUsers());
    }
  } catch {
    res.status(400).send('Invalid input');
  }
});

// Gets a specific user.
router.get('/:email', async (req, res) => {
  try {
    if (await utils.validateToken(req.headers.token)) {
      const user = await controller.getUser(req.params.email);
      return res.send(user);
    }
  } catch {
    res.status(400).send('Invalid payload');
  }
});

// Creates a new user.
router.post('/', async (req, res) => {
  try {
    if (validator.isEmail(req.body.email)) {
      const user = await controller.createUser(req.body);
      if (user !== false) {
        return res.send(user);
      }
    }
  } catch (e) {
    console.error(e);
  }
  return res.status(400).send('Invalid input');
});

// Updates any user.
router.put('/', async (req, res) => {
  try {
    if (validator.isEmail(req.body.email) && await utils.validateToken(req.headers.token, res)) {
      /** @todo add email and phone update options */
      const { email, password } = req.body;
      const user = await req.context.models.User.findOne({
        where: {
          email
        }
      });
      user.password = password;
      await user.save();
      return res.send(user.email + ' updated');
    }

    throw new Error('Invalid input');
  } catch {
    res.status(400).send('Invalid input');
  }
});

// Deletes a user.
router.delete('/:email', async (req, res) => {
  try {
    if (validator.isEmail(req.params.email) && await utils.validateToken(req.headers.token, res)) {
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

export default router;
