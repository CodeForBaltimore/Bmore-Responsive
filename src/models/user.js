import crypto from 'crypto';
import validator from 'validator';
import jwt from 'jsonwebtoken';

const user = (sequelize, DataTypes) => {
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

	User.validateToken = async token => {
		const valid = await User.findOne({
			where: {token}
		});

		if (valid) {
			return true;
		}

		return false;
	};

	// User Helpers
	User.generateSalt = () => {
		return crypto.randomBytes(16).toString('base64');
	};

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
		const token = jwt.sign({_id: user.id}, process.env.JWT_KEY);
		user.token = token;
	};

	// Other Helpers
	const validateContactInfo = user => {
		let valid = true;

		if (!validator.isEmail(validator.normalizeEmail(user.email))) {
			valid = false;
		}

		return valid;
	};

	// Create prep actions
	User.beforeCreate(validateContactInfo);
	User.beforeCreate(setSaltAndPassword);

	// Update prep actions
	User.beforeUpdate(validateContactInfo);
	User.beforeUpdate(setSaltAndPassword);
	User.beforeUpdate(setToken);

	return User;
};

export default user;
