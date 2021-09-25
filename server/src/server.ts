import Express, { NextFunction } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import mongoose from 'mongoose';
import expressJwt from 'express-jwt';
import httpStatus from 'http-status-codes';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cors from 'cors';
import jwt from 'jsonwebtoken';

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

	await mongoose.connect(env.mongo.url, env.mongo.options);
	const db = mongoose.connection;
	db.on('error', function (err) {
		console.error('MongoDB connection error: ' + err);
	});

	const server = new ApolloServer({
		schema,
		// context: ({ req, res }): Context => {
		// 	// let user = req.user as TokenUser;
		// 	// return { req, user, res };
		// },
		tracing: true,
		cacheControl: true,
		playground: {
			settings: {
				'request.credentials': 'include',
			},
		},
	});

	const app = Express();

	app.use(cors());

	app.use(function (req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		res.header(
			'Access-Control-Allow-Methods',
			'GET, POST, OPTIONS, PUT, PATCH, DELETE'
		);
		next();
	});

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

	app.use(cookieParser());
	app.use(server.graphqlPath, jwtParser, handleJwtError);

	app.post('/auth/google/signin', async (req, res) => {
		let googleToken = req.body.token;
		let user = await auth.google.signIn(googleToken);
		let authToken = await user?.generateJWT();

		res.status(200).send({
			user: user,
			token: authToken,
		});
	});

	server.applyMiddleware({
		app,
		cors: { origin: process.env.CLIENT_ORIGIN, credentials: true },
	});

	app.listen({ port: 8080 }, (): void =>
		console.log(
			`GraphQL is now running on: http://localhost:8080${server.graphqlPath}`
		)
	);
};

main().catch((error) => {
	console.log(error, 'error');
});
