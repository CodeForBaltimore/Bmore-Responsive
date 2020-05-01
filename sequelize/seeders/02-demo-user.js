const crypto = require('crypto');
const uuid = require('uuid4');
const users = require('../data/user.json');

const casbin = require('casbin');
const csa = require('casbin-sequelize-adapter');

const casbinConf = `${__dirname}/casbin.conf`;

module.exports = {
	up: async queryInterface => {
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
			element.createdAt = new Date();
			element.updatedAt = new Date();

			if (element.roles !== undefined) {
				for (const role of element.roles) {
					const dbUrl = process.env.DATABASE_URL;
					const a = await csa.SequelizeAdapter.newAdapter(
						dbUrl,
						{
							dialect: 'postgres'
						}
					);
					const e = await casbin.newEnforcer(casbinConf, a);

					await e.addRoleForUser(element.email, role)
				}
				delete element.roles;
			}
			delete element.roles;
		}

		return queryInterface.bulkInsert('Users', users);
	},
	down: async queryInterface => {
		return queryInterface.bulkDelete('Users', null, {});
	}
};
