'use strict';

import crypto from 'crypto';
import validator from 'validator';
import { newEnforcer } from 'casbin';

const enforcer =  newEnforcer('../../casbin/model.conf', '../../casbin/policy.csv');

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
const validateToken = async (req) => {
	const authorized = await req.context.models.User.validateToken(req.headers.token);
	if (authorized || process.env.BYPASS_LOGIN) {
		req.context.me = authorized; // add user object to context
		return true;
	} 
	
	return false;
};

const validateRoles = async (req) => {
	console.log(req.method)
	console.log(req.originalUrl)
	if (req.context.me.roles) {
		const roles = await req.context.models.UserRole.findRoles(req.context.me.roles);
		for (const role of roles) {
			console.log(role.role)
			const auth = await enforcer.enforce(role.role, req.originalUrl, req.method);
			console.log(auth)
		}
	}

	return true;
}

/**
 * Middleware function used to validate a user token
 * 
 * @param {*} req the request object
 * @param {*} res the response object
 * @param {*} next the next handler in the chain
 */
const authMiddleware = async (req, res, next) => {
	let authed = await validateToken(req);
	authed = await validateRoles(req);
	
	if (authed) {
		next();
	} else {
		response(res, 401, "");
	}

}

/**
 * 
 * @param {*} res the response object
 * @param {Number} code the response code 
 * @param {String} message a custom response message
 */
const response = (res, code, message) => {
	const codes = {
		200: message,
		400: "Bad Request",
		401: "Unauthorized",
		403: "Forbidden",
		422: "Invalid input",
		500: "Server error"
	};

	return res.status(code).send(codes[code]);
}

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

/**
 * Checks array of emails for validitiy
 * 
 * @param {Array} emails
 * 
 * @return {Boolean}
 */
const validateEmails = async emails => {
	for (let email of emails) {
		if (!validator.isEmail(email.address)) return false;
	}

	return true;
}

export default {
	formatTime,
	authMiddleware,
	response,
	encryptPassword,
	validateEmails
};
