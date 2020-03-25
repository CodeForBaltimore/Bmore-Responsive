import 'dotenv/config';

import cors from 'cors';
import express from 'express';
import requestId from 'express-request-id';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import swaggerDocument from '../docs/swagger/swagger.json';
import models, { sequelize } from './models';
import routes from './routes';
import utils from './utils';

const app = express();
const swaggerOptions = {
	customCss: '.swagger-ui .topbar { display: none }'
};

// Third-party middleware
app.use(requestId());
app.use(morgan('tiny'));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom middleware
app.use(async (req, res, next) => {
	// Making our models available in the request.
	req.context = {
		models
	};

	/** @todo add some checks for auth tokens, etc */
	// req.context.me = {
	// 	id: 'abc-123'
	// };

	next();
});

// Helper endpoints
app.get('/', (req, res) => {
	res.redirect('/api-docs');
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument,swaggerOptions));
app.use('/health', (req, res) => {
	res.status(200).json({
		uptime: utils.formatTime(process.uptime()),
		environment: process.env.NODE_ENV || 'n/a',
		version: process.env.npm_package_version || 'n/a',
		requestId: req.id
	});
});

// Routes
Object.entries(routes).forEach(([key, value]) => {
	app.use(`/${key}`, value);
});

// Starting Express and connecting to PostgreSQL
sequelize.sync().then(async () => {
	app.listen(process.env.PORT || 3000, () => {
		console.log(`Bmore Responsive is available at http://localhost:${process.env.PORT || 3000}`);
	});
});

export default app;
