// Import utils from '../utils';

// Only returning 200.  Probably should refactor response to add extra codes
// const ok = utils.withStatusCode(200,JSON.stringify);
// const parseJson = utils.parseWith(JSON.parse);

const getAll = async req => {
	return req.context.models.User.findAll();
};

const getUser = async req => {
	return req.context.models.User.findByPk(
		req.params.userId
	);
};

export default {
	getAll,
	getUser
};
