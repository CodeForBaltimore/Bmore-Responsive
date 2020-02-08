'use strict';

import models from '../models';

/**
 * Formats a timestamp to something readable by humans.
 *
 * @param {Number} seconds
 *
 * @return {String}
 */
const formatTime = seconds => {
	function pad(s) {
		return (s < 10 ? '0' : '') + s;
	}

	const hours = Math.floor(seconds / (60 * 60));
	const minutes = Math.floor(seconds % (60 * 60) / 60);
	const secs = Math.floor(seconds % 60);

	return pad(hours) + ':' + pad(minutes) + ':' + pad(secs);
};

/**
 * Creates a dummy user for development purposes.
 */
const seedUsers = async () => {
	await models.User.create(
		{
			email: 'test@test.test',
			password: process.env.SEED_DATA_PASSWORD
		}
	);

	console.log('Database user seeding finished!');
};

/**
 * Creates a dummy user role for development purposes.
 */
const seedUserRoles = async () => {
	await models.UserRole.create(
		{
			role: "test",
			description: "This is a test role."
		}
	);
	console.log('Database user roles seeding finished!');
}

/**
 * Validates a user login token.
 *
 * This validates a user token. If the token is invalid the request will immediately be rejected back with a 401.
 *
 * @param {*} req The request object.
 * @param {*} res The response object.
 *
 * @return {Boolean}
 */
const validateToken = async (req, res) => {
	if (process.env.BYPASS_LOGIN) {
		return true;
	}

	if (await req.context.models.User.validateToken(req.headers.token)) {
		return true;
	}

	res.status(401).send('Unauthorized');
};

export default {
	formatTime,
	seedUsers,
	seedUserRoles,
	validateToken
};
