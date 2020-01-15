'use strict';

import models from '../models';

const formatTime = seconds => {
	function pad(s) {
		return (s < 10 ? '0' : '') + s;
	}

	const hours = Math.floor(seconds / (60 * 60));
	const minutes = Math.floor(seconds % (60 * 60) / 60);
	const secs = Math.floor(seconds % 60);

	return pad(hours) + ':' + pad(minutes) + ':' + pad(secs);
};

const seedUsers = async () => {
	await models.User.create(
		{
			username: 'goku',
			password: process.env.SEED_DATA_PASSWORD
		}
	);

	console.log('Database seeding finished!');
};

export default {
	formatTime,
	seedUsers
};
