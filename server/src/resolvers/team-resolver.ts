import {
	Resolver,
	Query,
	Mutation,
	Arg,
	FieldResolver,
	Root,
	Ctx,
	Authorized,
} from 'type-graphql';
import { ObjectId } from 'mongodb';

import { ObjectIdScalar } from '../object-id.scalar';

import { Team, TeamModel } from '../entities/team';
import { TeamInput } from './input-models/team-input';

import { User, UserModel } from '../entities/user';
import { Board, BoardModel } from '../entities/board';
import {
	AuthenticationError,
	UserInputError,
	ForbiddenError,
} from 'apollo-server-errors';
import { Context } from '../interfaces/context';

@Resolver((of) => Team)
export class TeamResolver {
	@Authorized()
	@Query((returns) => Team)
	async team(
		@Arg('teamId', (type) => ObjectIdScalar) teamId: ObjectId,
		@Ctx() { user }: Context
	) {
		const team = await TeamModel.findById(teamId);
		if (!team) {
			throw new UserInputError('Invalid Team ID provided');
		}
		if (!team.isMember(user._id)) {
			throw new ForbiddenError('Not authorized to view resource');
		}
		return team;
	}

	@Authorized()
	@Mutation(() => Team)
	async createTeam(
		@Arg('data') teamInput: TeamInput,
		@Ctx() { user }: Context
	): Promise<Team> {
		const team = new TeamModel({
			...teamInput,
			members: [user._id],
		});

		user.teams.push(team._id);

		await team.save();
		await user.save();
		return team;
	}

	@Authorized()
	@Mutation(() => Team)
	async addTeamMember(
		@Arg('teamId', (type) => ObjectIdScalar) teamId: ObjectId,
		@Arg('userId', (type) => ObjectIdScalar) userId: ObjectId,
		@Ctx() { user }: Context
	) {
		const team = await TeamModel.findById(teamId);
		if (!team) {
			throw new UserInputError('Invalid Team ID');
		}

		if (!team.isMember(user._id)) {
			throw new ForbiddenError('Not authorized to view resource');
		}

		const userModel = await UserModel.findById(userId);
		if (!userModel) {
			throw new UserInputError('Invalid User ID');
		}

		if (!team.isMember(userModel._id)) {
			team.members.push(userModel._id);
			userModel.teams.push(team._id);
			await team.save();
			await userModel.save();
		}

		return team;
	}

	@Authorized()
	@Mutation(() => Team)
	async removeTeamMember(
		@Arg('teamId', (type) => ObjectIdScalar) teamId: ObjectId,
		@Arg('userId', (type) => ObjectIdScalar) userId: ObjectId,
		@Ctx() { user }: Context
	) {
		const team = await TeamModel.findById(teamId);
		if (!team) {
			throw new UserInputError('Invalid Team ID');
		}

		if (!team.isMember(user._id)) {
			throw new ForbiddenError('Not authorized to view resource');
		}

		const userModel = await UserModel.findById(userId);
		if (!userModel) {
			throw new UserInputError('Invalid User ID');
		}

		for (let i = 0; i < team.members.length; i++) {
			if (team.members[i].toString() == userModel._id.toString()) {
				team.members.splice(i, 1);
				break;
			}
		}
		for (let i = 0; i < userModel.teams.length; i++) {
			if (userModel.teams[i].toString() == team._id.toString()) {
				console.log('remove');
				userModel.teams.splice(i, 1);
				break;
			}
		}
		await team.save();
		await userModel.save();

		return team;
	}

	@FieldResolver()
	async members(@Root() team: Team): Promise<User[]> {
		let members: User[] = [];
		for (let userId of team._doc.members) {
			let user = await UserModel.findById(userId);
			if (user) {
				members.push(user);
			}
		}
		return members;
	}

	@FieldResolver()
	async boards(@Root() team: Team): Promise<Board[]> {
		let boards: Board[] = [];
		for (let boardId of team._doc.boards) {
			let board = await BoardModel.findById(boardId);
			if (board) {
				boards.push(board);
			}
		}
		return boards;
	}
}
