import Express, { NextFunction } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import mongoose from 'mongoose';
import expressJwt from 'express-jwt';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import bodyParser from 'body-parser';

import env from './environments/environmentConfig';

import { UserResolver } from './resolvers/user-resolver';
import { BoardResolver } from './resolvers/board-resolver';
import { ListResolver } from './resolvers/list-resolver';
import { TeamResolver } from './resolvers/team-resolver';
import { TaskResolver } from './resolvers/task-resolver';
import { Context } from './interfaces/context';
import { ErrorInterceptor } from './middleware/error-interceptor';
import GoogleAuthConfig from './auth/google-auth-config';

const main = async () => {
	/* Set up and connect to db */
	await mongoose.connect(env.mongo.url, env.mongo.options);
	const db = mongoose.connection;
	db.on('error', function (err) {
		console.error('MongoDB connection error: ' + err);
	});

	/* Set up https express server */

	const key = fs.readFileSync(__dirname + '/..' + env.https.key);
	const cert = fs.readFileSync(__dirname + '/..' + env.https.cert);

	const app = Express();

	const httpsServer = https.createServer({ key: key, cert: cert }, app);

	/* Set up graphql schema and Apollo server */
	const schema = await buildSchema({
		resolvers: [
			UserResolver,
			BoardResolver,
			ListResolver,
			TeamResolver,
			TaskResolver,
		],
		emitSchemaFile: true,
		globalMiddlewares: [ErrorInterceptor],
	});

	const server = new ApolloServer({ schema: schema });

	app.use(cors());

	app.use(function (req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header(
			'Access-Control-Allow-Headers',
			'Origin, X-Requested-With, Content-Type, Accept'
		);
		res.header(
			'Access-Control-Allow-Methods',
			'GET, POST, OPTIONS, PUT, PATCH, DELETE'
		);
		if (req.method === 'OPTIONS') {
			return res.status(200).end();
		}
		next();
	});

	app.use(bodyParser.json());

	const auth = { google: new GoogleAuthConfig() };

	const jwtParser = expressJwt({
		credentialsRequired: false,
		secret: env.auth.jwt.secret,
		algorithms: ['RS256'],
		getToken: (req) => {
			if (
				req.headers.authorization &&
				req.headers.authorization.split(' ')[0] === 'Bearer'
			) {
				return req.headers.authorization.split(' ')[1];
			} else if (req.query && req.query.token) {
				return req.query.token;
			}
			return null;
		},
	});

	function handleJwtError(
		err: any,
		req: Express.Request,
		res: Express.Response,
		next: NextFunction
	) {
		if (err.code === 'invalid_token') return next();
		return next(err);
	}

	app.use(server.graphqlPath, jwtParser, handleJwtError);

	app.post('/auth/google/signin', async (req, res) => {
		console.log(req.body);
		let googleToken = req.body.token;
		let user = await auth.google.signIn(googleToken);
		let authToken = await user?.generateJWT();

		res.status(200).send({
			user: user,
			token: authToken,
		});
	});
	app.get('/', (req, res) => {
		res.status(200).send({ message: 'Received' });
	});

	await server.start();
	server.applyMiddleware({ app });

	httpsServer.listen({ port: 8080 }, (): void =>
		console.log(
			`GraphQL is now running on: https://localhost:8080${server.graphqlPath}`
		)
	);
};

main().catch((error) => {
	console.log(error, 'error');
});
