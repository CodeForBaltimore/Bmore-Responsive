import Sequelize from 'sequelize';
import path from 'path';
import fs from 'fs';
import _ from 'lodash';

let dbUrl;

if (process.env.DATABASE_URL) {
	dbUrl = process.env.DATABASE_URL;
} else {
	dbUrl = `postgres://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;
}

// Initializes the database.
const sequelize = new Sequelize(
	dbUrl,
	{
		dialect: 'postgres'
	}
);
const basename = path.basename(__filename);
const models = {};

// Ensuring our database is connected. If not, the application will not run...
sequelize.authenticate().then(e => {
	if (e) {
		console.error('Error: unable to connect to database');
	}

	console.log('Connection to database successful');
});

// Defines our models.
fs
	.readdirSync(__dirname)
	.filter(file => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
	})
	.forEach(file => {
		models[_.upperFirst(_.camelCase(file.replace('.js', '')))] = sequelize.import(`./${file.replace('.js', '')}`);
	});

// Bringing it all together easily for use.
Object.keys(models).forEach(key => {
	if ('associate' in models[key]) {
		models[key].associate(models);
	}
});

export {sequelize};
export default models;
