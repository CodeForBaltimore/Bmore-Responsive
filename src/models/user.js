const user = (sequelize, DataTypes) => {
	const User = sequelize.define('user', {
		username: {
			type: DataTypes.STRING,
			unique: true
		},
		password: {
			type: DataTypes.STRING
		}
	});

	User.findByLogin = async login => {
		let user = await User.findOne({
			where: {username: login}
		});
		if (!user) {
			user = await User.findOne({
				where: {email: login}
			});
		}

		return user;
	};

	return User;
};

export default user;
