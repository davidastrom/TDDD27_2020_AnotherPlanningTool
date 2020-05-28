import Express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { connect, mongo } from 'mongoose';
import passport from 'passport';
import jwt from 'express-jwt';
import httpStatus from 'http-status-codes';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import { environment } from './environments/environment';

import { UserResolver } from './resolvers/user-resolver';
import { BoardResolver } from './resolvers/board-resolver';
import { ListResolver } from './resolvers/list-resolver';
import { TeamResolver } from './resolvers/team-resolver';
import { TaskResolver } from './resolvers/task-resolver';
import { Context } from './interfaces/context';
import { ErrorInterceptor } from './middleware/error-interceptor';
import { passportSetup } from './passport';
import { errSchema } from './utils/responses';

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
		context: ({ req, res }): Context => ({ req, res }),
	});

	const app = Express();

	const jwtParser = jwt({
		credentialsRequired: false,
		secret: process.env.JWT_SECRET || 'super secret',
		getToken: (req) => {
			if (req.cookies.token) return req.cookies.token;
			return null;
		},
	});

	app.use(cookieParser());
	app.use(jwtParser);
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
			if (!req.user)
				res.status(httpStatus.NOT_FOUND).send(
					errSchema('User not found', httpStatus.NOT_FOUND)
				);
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
