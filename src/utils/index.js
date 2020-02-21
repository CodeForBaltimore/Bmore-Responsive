'use strict';

import crypto from 'crypto';

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

/**
	 * Salts and hashes a password.
	 *
	 * @param {String} password The unhashed or salted password.
	 * @param {String} salt The password salt for this user.
	 *
	 * @return {String} The secured password.
	 */
const encryptPassword = (password, salt) => {
	return crypto
		.createHash('RSA-SHA256')
		.update(password)
		.update(salt)
		.digest('hex');
};

export default {
	formatTime,
	validateToken,
	encryptPassword
};
