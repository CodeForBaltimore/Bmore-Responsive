const userRole = (sequelize, DataTypes) => {
	// Defining our userRole table and setting UserRole object.
	const UserRole = sequelize.define('userRole', {
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
