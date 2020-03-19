import { Router } from 'express';
import validator from 'validator';
import utils from '../utils';
import controller from '../controllers/user';

const router = new Router();

// User login.
router.post('/login', async (req, res) => {
  try {
    const output = await controller.login(req.body);
    return res.send(output);
  } catch (e) {
    console.error(e);
  }
  res.status(422).send('Invalid input');
});

// Gets all users.
router.get('/', async (req, res) => {
  try {
    const output = await controller.getUsers(req.headers.token);
    return res.send(output);
  } catch (e) {
    console.error(e);
  }
  res.status(422).send('Invalid input');
});

// Gets a specific user.
router.get('/:email', async (req, res) => {
  try {
    const user = await controller.getUser(req.headers.token, req.params.email);
    return res.send(user);
  } catch (e) {
    console.error(e);
  }
  res.status(422).send('Invalid input');
});

// Creates a new user.
router.post('/', async (req, res) => {
  try {
    const user = await controller.createUser(req.body);
    if (user !== false) {
      return res.send(user);
    }
  } catch (e) {
    console.error(e);
  }
  return res.status(400).send('Invalid input');
});

// Updates any user.
router.put('/', async (req, res) => {
  try {
    if (await utils.validateToken(req.headers.token, res)) {
      const user = await controller.updateUser(req.body);
      return res.send(user);
    }
  } catch (e) {
    console.error(e);
  }

  res.status(400).send('Invalid input');
});

// Deletes a user.
router.delete('/:email', async (req, res) => {
  try {
    if (await utils.validateToken(req.headers.token, res)) {
      const user = await controller.deleteUser(req.params.email);
      return res.send(user);
    }
  } catch (e) {
    console.error(e);
  }

  res.status(400).send('Invalid input');
});

export default router;
