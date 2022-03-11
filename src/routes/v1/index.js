import user from './user'
import userRole from './user-role'
import contact from './contact'
import entity from './entity'
import csv from './csv'
import health from './health'
// Exports object of routes we import above. Add to this if you're adding new routes.

const routeExports = {
  user,
  userRole,
  contact,
  entity,
  csv,
  health
}

export default routeExports
module.exports = routeExports
