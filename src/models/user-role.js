const userRole = (sequelize, DataTypes) => {
	// Defining our userRole table and setting UserRole object.
	const UserRole = sequelize.define('UserRole', {
		role: {
			type: DataTypes.STRING,
			unique: true,
			required: true
		},
		description: {
			type: DataTypes.STRING
		}
	},
	{
		schema: process.env.DATABASE_SCHEMA
	});

	return UserRole;
};

export default userRole;
