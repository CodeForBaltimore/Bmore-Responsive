require('dotenv').config();
const fs = require('fs');
const rdsCa = fs.readFileSync('./rds-combined-ca-bundle.pem');

module.exports = {
	development: {
		database: process.env.DATABASE_NAME,
		username: process.env.DATABASE_USERNAME,
		password: process.env.DATABASE_PASSWORD,
		port: process.env.DATABASE_PORT,
		host: process.env.DATABASE_HOST,
		dialect: 'postgres',
	},
	production: {
		database: process.env.DATABASE_NAME,
		username: process.env.DATABASE_USERNAME,
		password: process.env.DATABASE_PASSWORD,
		port: process.env.DATABASE_PORT,
		host: process.env.DATABASE_HOST,
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
