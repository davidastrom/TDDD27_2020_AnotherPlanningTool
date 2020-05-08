import Express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { connect, mongo } from 'mongoose';
import { environment } from './environments/environment';

import { UserResolver } from './resolvers/user-resolver';
import { BoardResolver } from './resolvers/board-resolver';
import { ListResolver } from './resolvers/list-resolver';
import { TeamResolver } from './resolvers/team-resolver';
import { TaskResolver } from './resolvers/task-resolver';

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
	});

	const mongoose = await connect(
		environment.mongo.url,
		environment.mongo.options,
	);
	mongoose.connection.on('error', function (err) {
		console.error('MongoDB connection error: ' + err);
	});

	const server = new ApolloServer({ schema });
	const app = Express();

	server.applyMiddleware({ app });

	app.listen({ port: 8080 }, (): void =>
		console.log(
			`GraphQL is now running on: http://localhost:8080${server.graphqlPath}`,
		),
	);
};

main().catch((error) => {
	console.log(error, 'error');
});
