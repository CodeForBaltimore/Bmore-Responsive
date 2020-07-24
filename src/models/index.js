import Sequelize from 'sequelize'
import path from 'path'
import fs from 'fs'
import _ from 'lodash'
import tls from 'tls'

const rdsCa = fs.readFileSync('./rds-combined-ca-bundle.pem')

// Securing our db connection if prod
/** @todo allow other options besides RDS */

let dialectOptions
if (process.env.NODE_ENV === 'production') {
	dialectOptions = {
		ssl: {
			rejectUnauthorized: true,
			ca: [rdsCa],
			checkServerIdentity: (host, cert) => {
				const error = tls.checkServerIdentity(host, cert)
				if (error && !cert.subject.CN.endsWith('.rds.amazonaws.com')) {
					return error
				}
			}
		}
	}
}

// Initializes the database.
const sequelize = new Sequelize(
	{
		database: process.env.DATABASE_NAME,
		username: process.env.DATABASE_USERNAME,
		password: process.env.DATABASE_PASSWORD,
		port: process.env.DATABASE_PORT,
		host: process.env.DATABASE_HOST,
  	    logging: false,
		dialect: 'postgres',
		dialectOptions
	}
)
const basename = path.basename(__filename)
const models = {}

// Ensuring our database is connected. If not, the application will not run...
sequelize.authenticate().then(e => {
	if (e) {
		console.error('Error: unable to connect to database')
	}

	console.log('Connection to database successful')
})

// Defines our models.
fs
	.readdirSync(__dirname)
	.filter(file => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
	})
	.forEach(file => {
		models[_.upperFirst(_.camelCase(file.replace('.js', '')))] = sequelize.import(`./${file.replace('.js', '')}`)
	})

// Bringing it all together easily for use.
Object.keys(models).forEach(key => {
	if ('associate' in models[key]) {
		models[key].associate(models)
	}
})

export { sequelize }
export default models
