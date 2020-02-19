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

	/**
	 * Translates ids to plain text for UserRoles
	 * 
	 * @param {Array} user The user object for lookup
	 * 
	 * @return {Array} 
	 */
	UserRole.findRoles = async (roles) => {
		const cleanRoles = [];
		for (const element of roles) {
			const role = await UserRole.findOne({
				where: {
					id: element
				},
				attributes: ['id', 'role', 'description']
			});
			cleanRoles.push(role);
		}
		return cleanRoles;
	}

	return UserRole;
};

export default userRole;
