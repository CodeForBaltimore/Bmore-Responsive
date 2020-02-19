const crypto = require('crypto');
const uuid = require('uuid4');
const users = require('../data/user.json');

module.exports = {
	up: queryInterface => {
		const encryptPassword = (password, salt) => {
			return crypto
				.createHash('RSA-SHA256')
				.update(password)
				.update(salt)
				.digest('hex');
		};

		for (const element of users) {
			const salt = crypto.randomBytes(16).toString('base64');
			const id = uuid();

			element.salt = salt;
			element.id = id;
			element.password = encryptPassword(element.password, salt);
			element.roles = JSON.stringify(element.roles);
			element.createdAt = new Date();
			element.updatedAt = new Date();
		}

		return queryInterface.bulkInsert('Users', users);
	},
	down: queryInterface => {
		return queryInterface.bulkDelete('Users', null, {});
	}
};
