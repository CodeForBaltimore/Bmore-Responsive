import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import utils from '../utils';

const user = (sequelize, DataTypes) => {
	// Defining our user table and setting User object.
	const User = sequelize.define('User', {
		id: {
		  type: DataTypes.UUID,
		  primaryKey: true,
		  defaultValue: DataTypes.UUIDV4,
		  allowNull: false,
		  autoIncrement: false,
		},
		email: {
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
		roles: {
			type: DataTypes.JSON
		},
		displayName: {
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
	 * Looks up and validates a user by email and password.
	 *
	 * @param {String} login The email or email of the user.
	 * @param {String} password The password of the user.
	 *
	 * @return {String} returns either the valid login token or an error message.
	 */
	User.findByLogin = async (email, password) => {
		const user = await User.findOne({
			where: {email}
		});
		if (user) {
			const pw = User.encryptPassword(password, user.salt);
			if (pw === user.password) {
				return await User.getToken(user.id);
			}
		}
	};

	/**
	 * Validates a login token.
	 *
	 * @param {String} token The login token from the user.
	 *
	 * @return {Boolean}
	 */
	User.validateToken = async token => {
		/** @todo check if it is a token at all */
		if (token) {
			try {
				const decoded = jwt.verify(token, process.env.JWT_KEY);
				const now = new Date();
				if (now.getTime() < decoded.exp * 1000) {
					const user = await User.findByPk(decoded.userId);
					if (user) {
						return user;
					}
				}
			} catch (e) {
				console.error(e);
			}
		}
		return false;
	};

	User.getToken = async (userId, expiresIn = '1d') => {
		const token = jwt.sign(
			{userId},
			process.env.JWT_KEY,
			{expiresIn}
		);
		return token;
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
			// User.password = User.encryptPassword(user.password, user.salt);
			user.password = utils.encryptPassword(user.password, user.salt);
		}
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

	return User;
};

export default user;
