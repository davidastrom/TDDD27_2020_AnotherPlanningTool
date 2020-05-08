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

@Resolver((of) => Team)
export class TeamResolver {
	@Query((returns) => Team, { nullable: true })
	async team(@Arg('teamId', (type) => ObjectIdScalar) teamId: ObjectId) {
		return await TeamModel.findById(teamId);
	}

	@Query((returns) => [Team])
	async allTeams(): Promise<Team[]> {
		return await TeamModel.find();
	}

	@Mutation(() => Team)
	async createTeam(@Arg('data') { name }: TeamInput): Promise<Team> {
		const Team = (
			await TeamModel.create({
				name,
			})
		).save();
		return Team;
	}

	@Mutation(() => Team)
	async addTeamMember(
		@Arg('teamId', (type) => ObjectIdScalar) teamId: ObjectId,
		@Arg('userId', (type) => ObjectIdScalar) userId: ObjectId,
	) {
		const Team = await TeamModel.findById(teamId);
		if (!Team) {
			throw new Error('Invalid Team ID');
		}

		const User = await UserModel.findById(userId);
		if (!User) {
			throw new Error('Invalid User ID');
		}

		let userInMember: boolean = false;
		let teamInTeams: boolean = false;

		for (let id of Team.members) {
			if (id.toString() == User._id.toString()) {
				userInMember = true;
			}
		}
		if (!userInMember) {
			Team.members.push(User._id);
			User.teams.push(Team._id);
			await Team.save();
			await User.save();
		}

		return Team;
	}

	@Mutation(() => Team)
	async removeTeamMember(
		@Arg('teamId', (type) => ObjectIdScalar) teamId: ObjectId,
		@Arg('userId', (type) => ObjectIdScalar) userId: ObjectId,
	) {
		const Team = await TeamModel.findById(teamId);
		if (!Team) {
			throw new Error('Invalid Team ID');
		}

		const User = await UserModel.findById(userId);
		if (!User) {
			throw new Error('Invalid User ID');
		}

		for (let i = 0; i < Team.members.length; i++) {
			if (Team.members[i].toString() == User._id.toString()) {
				Team.members.splice(i, 1);
				await Team.save();
				break;
			}
		}
		for (let i = 0; i < User.teams.length; i++) {
			if (User.teams[i].toString() == Team._id.toString()) {
				User.teams.splice(i, 1);
				await User.save();
				break;
			}
		}
		return Team;
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
