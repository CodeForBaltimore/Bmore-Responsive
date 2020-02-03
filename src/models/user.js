import crypto from 'crypto';
import jwt from 'jsonwebtoken';
// Import validator from 'validator';

const user = (sequelize, DataTypes) => {
	// Defining our user table and setting User object.
	const User = sequelize.define('user', {
		username: {
			type: DataTypes.STRING,
			unique: true,
			required: true
		},
		password: {
			type: DataTypes.STRING,
			required: true
		},
		salt: {
			type: DataTypes.STRING
		},
		token: {
			type: DataTypes.STRING
		},
		email: {
			type: DataTypes.STRING
		},
		phone: {
			type: DataTypes.STRING
		}
	},
	{
		schema: process.env.DATABASE_SCHEMA
	});

	/**
	 * Looks up and validates a user by username and password.
	 *
	 * @param {String} login The username or email of the user.
	 * @param {String} password The password of the user.
	 *
	 * @return {String} returns either the valid login token or an error message.
	 */
	User.findByLogin = async (login, password) => {
		let user = await User.findOne({
			where: {username: login}
		});
		if (!user) {
			user = await User.findOne({
				where: {email: login}
			});
		}
		
		if (user) {
			const pw = User.encryptPassword(password, user.salt);

			if (pw === user.password) {
				await user.update();
				return user.token;
			}
		}

		return 'Invalid credentials';
	};

	/**
	 * Validates a login token.
	 *
	 * @param {String} token The login token from the user.
	 *
	 * @return {Boolean}
	 */
	User.validateToken = async token => {
		const expiry = jwt.decode(token).exp;
		const now = new Date();

		if (now.getTime() < expiry * 1000) {
			const user = await User.findOne({
				where: {token}
			});

			if (user) {
				try {
					return jwt.verify(user.token, process.env.JWT_KEY, {username: user.username});
				} catch {
					return false;
				}
			}
		}

		return false;
	};

	/**
	 * Generates a random salt for password security.
	 *
	 * @return {String} The password salt.
	 */
	User.generateSalt = () => {
		return crypto.randomBytes(16).toString('base64');
	};

	/**
	 * Salts and hashes a password.
	 *
	 * @param {String} plainText The unhashed or salted password.
	 * @param {String} salt The password salt for this user.
	 *
	 * @return {String} The secured password.
	 */
	User.encryptPassword = (plainText, salt) => {
		return crypto
			.createHash('RSA-SHA256')
			.update(plainText)
			.update(salt)
			.digest('hex');
	};

	// Setters
	const setSaltAndPassword = user => {
		if (user.changed('password')) {
			user.salt = User.generateSalt();
			user.password = User.encryptPassword(user.password, user.salt);
		}
	};

	const setToken = user => {
		const token = jwt.sign(
			{username: user.username},
			process.env.JWT_KEY,
			{expiresIn: '1d'}
		);

		user.token = token;
	};

	// Other Helpers
	// const validateContactInfo = user => {
	// 	let valid = true;

	// 	if (!validator.isEmail(validator.normalizeEmail(user.email))) {
	// 		valid = false;
	// 	}

	// 	/** @todo Add more validations for all contact info. */

	// 	return valid;
	// };

	// Create prep actions
	// User.beforeCreate(validateContactInfo);
	User.beforeCreate(setSaltAndPassword);

	// Update prep actions
	// User.beforeUpdate(validateContactInfo);
	User.beforeUpdate(setSaltAndPassword);
	User.beforeUpdate(setToken);

	return User;
};

export default user;
