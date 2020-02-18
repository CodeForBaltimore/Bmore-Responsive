const crypto = require('crypto');
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

			element.salt = salt;
			element.password = encryptPassword(element.password, salt);
			element.createdAt = new Date();
			element.updatedAt = new Date();
		}

		return queryInterface.bulkInsert('Users', users);
	},
	down: queryInterface => {
		return queryInterface.bulkDelete('Users', null, {});
	}
};
