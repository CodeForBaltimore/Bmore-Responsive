import user from './user';
import userRole from './user-role';
// Exports object of routes we import above. Add to this if you're adding new routes.
export default {
	user: user.router,
	userRole: userRole.router
};
