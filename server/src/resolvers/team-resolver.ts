import {
	Resolver,
	Query,
	Mutation,
	Arg,
	FieldResolver,
	Root,
} from 'type-graphql';
import { ObjectId } from 'mongodb';

import { ObjectIdScalar } from '../object-id.scalar';

import { Team, TeamModel } from '../entities/team';
import { TeamInput } from './types/team-input';

import { User, UserModel } from '../entities/user';
import { Board, BoardModel } from '../entities/board';
import { UserInputError } from 'apollo-server-errors';

@Resolver((of) => Team)
export class TeamResolver {
	@Query((returns) => Team)
	async team(@Arg('teamId', (type) => ObjectIdScalar) teamId: ObjectId) {
		const team = await TeamModel.findById(teamId);
		if (!team) {
			throw new UserInputError('Invalid Team ID provided');
		}
		return team;
	}

	@Query((returns) => [Team])
	async allTeams(): Promise<Team[]> {
		return await TeamModel.find();
	}

	@Mutation(() => Team)
	async createTeam(@Arg('data') teamInput: TeamInput): Promise<Team> {
		const team = new TeamModel({
			...teamInput,
		});
		await team.save();
		return team;
	}

	@Mutation(() => Team)
	async addTeamMember(
		@Arg('teamId', (type) => ObjectIdScalar) teamId: ObjectId,
		@Arg('userId', (type) => ObjectIdScalar) userId: ObjectId
	) {
		const team = await TeamModel.findById(teamId);
		if (!team) {
			throw new Error('Invalid Team ID');
		}

		const user = await UserModel.findById(userId);
		if (!user) {
			throw new Error('Invalid User ID');
		}

		let userInMember: boolean = false;
		let teamInTeams: boolean = false;

		for (let id of team.members) {
			if (id.toString() == user._id.toString()) {
				userInMember = true;
			}
		}
		if (!userInMember) {
			team.members.push(user._id);
			user.teams.push(team._id);
			await team.save();
			await user.save();
		}

		return Team;
	}

	@Mutation(() => Team)
	async removeTeamMember(
		@Arg('teamId', (type) => ObjectIdScalar) teamId: ObjectId,
		@Arg('userId', (type) => ObjectIdScalar) userId: ObjectId
	) {
		const team = await TeamModel.findById(teamId);
		if (!team) {
			throw new Error('Invalid Team ID');
		}

		const user = await UserModel.findById(userId);
		if (!user) {
			throw new Error('Invalid User ID');
		}

		for (let i = 0; i < team.members.length; i++) {
			if (team.members[i].toString() == user._id.toString()) {
				team.members.splice(i, 1);
				await team.save();
				break;
			}
		}
		for (let i = 0; i < user.teams.length; i++) {
			if (user.teams[i].toString() == team._id.toString()) {
				user.teams.splice(i, 1);
				await user.save();
				break;
			}
		}
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
