require('dotenv').config();
const fs = require('fs');
const rdsCa = fs.readFileSync('./rds-combined-ca-bundle.pem');
const utils = require('../src/utils');

module.exports = {
	development: {
		use_env_variable: 'DATABASE_URL',
		dialect: 'postgres',
	},
	production: {
		use_env_variable: 'DATABASE_URL',
		dialect: 'postgres',
		dialectOptions: {
			ssl: {
				rejectUnauthorized: true,
				ca: [rdsCa],
				checkServerIdentity: (host, cert) => {
					const error = tls.checkServerIdentity(host, cert);
					if (error && !cert.subject.CN.endsWith('.rds.amazonaws.com')) {
						return error;
					}
				}
			}
		}
	},
};
