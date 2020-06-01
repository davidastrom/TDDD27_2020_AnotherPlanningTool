import Express, { NextFunction } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { connect, mongo } from 'mongoose';
import passport from 'passport';
import jwt from 'express-jwt';
import httpStatus from 'http-status-codes';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import cors from 'cors';

import { environment } from './environments/environment';

import { UserResolver } from './resolvers/user-resolver';
import { BoardResolver } from './resolvers/board-resolver';
import { ListResolver } from './resolvers/list-resolver';
import { TeamResolver } from './resolvers/team-resolver';
import { TaskResolver } from './resolvers/task-resolver';
import { Context } from './interfaces/context';
import { ErrorInterceptor } from './middleware/error-interceptor';
import { passportSetup } from './passport';
import { errSchema, resSchema } from './utils/responses';
import { TokenUser } from './interfaces/token-user';

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

	const mongoose = await connect(
		environment.mongo.url,
		environment.mongo.options
	);
	mongoose.connection.on('error', function (err) {
		console.error('MongoDB connection error: ' + err);
	});

	const server = new ApolloServer({
		schema,
		context: ({ req, res }): Context => {
			let user = req.user as TokenUser;
			return { req, user, res };
		},
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

	const jwtParser = jwt({
		credentialsRequired: false,
		secret: process.env.JWT_SECRET || 'super secret',
		getToken: (req) => {
			if (req.cookies.token) return req.cookies.token;
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
	app.use(
		session({
			secret: process.env.SESSION_SECRET || 'super secret',
			resave: false,
			saveUninitialized: false,
			cookie: { secure: process.env.NODE_ENV === 'production' },
		})
	);

	passportSetup();
	app.use(passport.initialize());
	app.use(passport.session());

	app.get(
		'/auth/google',
		passport.authenticate('google', {
			scope: [
				'https://www.googleapis.com/auth/plus.login',
				'profile',
				'email',
			],
		})
	);

	app.get(
		'/auth/google/callback',
		passport.authenticate('google', {
			failureRedirect: process.env.CLIENT_LOGIN_ROUTE,
			session: false,
		}),
		(req, res) => {
			if (!req.user) {
				res.status(httpStatus.UNAUTHORIZED).send(
					errSchema('User not found', httpStatus.UNAUTHORIZED)
				);
			}
			if (req.user) {
				let token_user = (req.user as any) as TokenUser;
				res.cookie('token', token_user.token, {
					expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
					httpOnly: true,
				});
				res.status(httpStatus.OK).redirect(
					process.env.CLIENT_ORIGIN || 'http://localhost:4200'
				);
			}
		}
	);

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
