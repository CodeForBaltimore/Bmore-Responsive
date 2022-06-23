import health from './health'
import security from './security'
import users from './users'
// Exports object of routes we import above. Add to this if you're adding new routes.

const routeExports = {
  health,
  security,
  users
}

module.exports = routeExports
