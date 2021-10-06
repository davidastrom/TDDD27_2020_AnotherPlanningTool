import {
	Resolver,
	Query,
	Arg,
	FieldResolver,
	Root,
	Ctx,
	Authorized,
} from 'type-graphql';
import { ObjectId } from 'mongodb';

import { ObjectIdScalar } from '../object-id.scalar';

import { User, UserModel } from '../entities/user';

import { Team, TeamModel } from '../entities/team';
import { Board, BoardModel } from '../entities/board';
import { Context } from '../interfaces/context';
import { AuthenticationError, UserInputError } from 'apollo-server-errors';

@Resolver((of) => User)
export class UserResolver {
	@Authorized()
	@Query((returns) => User)
	async user(@Arg('userId', (type) => ObjectIdScalar) userId: ObjectId) {
		const user = await UserModel.findById(userId);
		if (!user) {
			throw new UserInputError('Invalid User ID provided');
		}
		return user;
	}

	@Authorized()
	@Query((returns) => User)
	async currentUser(@Ctx() { user }: Context) {
		return user;
	}

	@Authorized()
	@Query((returns) => [User])
	async allUsers(): Promise<User[]> {
		return await UserModel.find();
	}

	// @Mutation((returns) => User)
	// async createUser(@Arg('user') userInput: UserInput): Promise<User> {
	// 	const user = new UserModel({
	// 		...userInput,
	// 	} as User);
	// 	await user.save();
	// 	return user;
	// }

	@FieldResolver()
	async teams(@Root() user: User): Promise<Team[]> {
		let teams: Team[] = [];
		for (let teamId of user._doc.teams) {
			let team = await TeamModel.findById(teamId);
			if (team) {
				teams.push(team);
			}
		}
		return teams;
	}

	@FieldResolver()
	async boards(@Root() user: User): Promise<Board[]> {
		let boards: Board[] = [];
		for (let boardId of user._doc.boards) {
			let board = await BoardModel.findById(boardId);
			if (board) {
				boards.push(board);
			}
		}
		return boards;
	}
}
