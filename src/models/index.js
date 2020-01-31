import Sequelize from 'sequelize';

// Initializes the database.
const sequelize = new Sequelize(
	process.env.DATABASE,
	process.env.DATABASE_USER,
	process.env.DATABASE_PASSWORD,
	{
		dialect: 'postgres'
	}
);

// Defines our models. Add to the model object if you're defining new tables, etc.
const models = {
	User: sequelize.import('./user')
};

// Bringing it all together easily for use.
Object.keys(models).forEach(key => {
	if ('associate' in models[key]) {
		models[key].associate(models);
	}
});

export {sequelize};
export default models;
