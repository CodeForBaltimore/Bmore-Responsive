'use strict';

import models from '../models';

/**
 * Formats a timestamp to something readable by humans.
 *
 * @param {Number} seconds
 *
 * @return {String}
 */
const formatTime = seconds => {
	function pad(s) {
		return (s < 10 ? '0' : '') + s;
	}

	const hours = Math.floor(seconds / (60 * 60));
	const minutes = Math.floor(seconds % (60 * 60) / 60);
	const secs = Math.floor(seconds % 60);

	return pad(hours) + ':' + pad(minutes) + ':' + pad(secs);
};

/**
 * Creates a dummy user for development purposes.
 */
const seedUsers = async () => {
	await models.User.create(
		{
			username: 'goku',
			password: process.env.SEED_DATA_PASSWORD,
			email: 'saiyensarerad@gmail.com'
		}
	);

	console.log('Database seeding finished!');
};

export default {
	formatTime,
	seedUsers
};
