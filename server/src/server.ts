import Express, { NextFunction } from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import mongoose from 'mongoose';
import expressJwt from 'express-jwt';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import http from 'http';
import bodyParser from 'body-parser';

import env from './environments/environmentConfig';

import { UserResolver } from './resolvers/user-resolver';
import { BoardResolver } from './resolvers/board-resolver';
import { ListResolver } from './resolvers/list-resolver';
import { TeamResolver } from './resolvers/team-resolver';
import { TaskResolver } from './resolvers/task-resolver';
import { ErrorInterceptor } from './middleware/error-interceptor';
import GoogleAuthConfig from './auth/google-auth-config';
import { UserModel } from './entities/user';
import { graphqlAuthChecker } from './auth/graphql-auth-checker';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';

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
	// const httpsServer = http.createServer(app);

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
		authChecker: graphqlAuthChecker,
		globalMiddlewares: [ErrorInterceptor],
	});

	const server = new ApolloServer({
		schema: schema,
		context: async ({ req }) => {
			// Get the user token from the headers.
			let token: string = '';
			if (
				req.headers.authorization &&
				req.headers.authorization.split(' ')[0] === 'Bearer'
			) {
				token = req.headers.authorization.split(' ')[1];
			}

			if (token) {
				// Try to retrieve a user with the token
				const user = await UserModel.getByToken(token);
				// Add the user to the context
				return { user };
			}

			return;
		},
		plugins: [
			{
				async serverWillStart() {
					return {
						async drainServer() {
							subscriptionServer.close();
						},
					};
				},
			},
		],
	});

	const subscriptionServer = SubscriptionServer.create(
		{
			schema,
			execute,
			subscribe,
			async onConnect(
				connectionParams: { authorization: string },
				webSocket: WebSocket
			) {
				if (connectionParams.authorization) {
					const user = await UserModel.getByToken(
						connectionParams.authorization
					);
					return { user };
				}
			},
		},
		{ server: httpsServer, path: server.graphqlPath }
	);

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

	app.post('/auth/google/signin', async (req, res) => {
		let googleToken = req.body.token;
		let user = await auth.google.signIn(googleToken);
		let authToken = await user?.generateJWT();

		res.status(200).send({
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
