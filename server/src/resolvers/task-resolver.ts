import { Resolver, Mutation, Root, FieldResolver, Arg } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { ObjectIdScalar } from '../object-id.scalar';
import { Task } from '../entities/task';

import { User, UserModel } from '../entities/user';
import { Board, BoardModel } from '../entities/board';
import { Team, TeamModel } from '../entities/team';

@Resolver((of) => Task)
export class TaskResolver {
	@Mutation((returns) => Task)
	async assignUser(
		@Arg('boardId', (type) => ObjectIdScalar) boardId: ObjectId,
		@Arg('listId', (type) => ObjectIdScalar) listId: ObjectId,
		@Arg('taskId', (type) => ObjectIdScalar) taskId: ObjectId,
		@Arg('userId', (tyep) => ObjectIdScalar) userId: ObjectId,
	) {
		const board = await BoardModel.findById(boardId);
		if (!board) {
			throw new Error('Invalid Board id');
		}

		let userInBoard: boolean = false;

		if (board.team) {
			const team = await TeamModel.findById(board.team);
			if (team) {
				const user = team.members.find(
					(id) => id.toString() == userId.toString(),
				);
				if (user) {
					userInBoard = true;
				}
			}
		}
		const user = board.members.find((id) => id.toString() == userId.toString());
		if (user) {
			userInBoard == true;
		}

		if (!userInBoard) {
			throw new Error('User not member of board');
		}

		const list = board.lists.find(
			(list) => list._id.toHexString() == listId.toHexString(),
		);
		if (!list) {
			throw new Error('Invalid List id');
		}

		const task = list.items.find(
			(task) => task._id.toHexString() == taskId.toHexString(),
		);
		if (!task) {
			throw new Error('Invalid Task id');
		}

		if (!task.assigned.find((id) => id.toString() == userId.toString())) {
			task.assigned.push(userId);
		}

		await board.save();

		return task;
	}

	@FieldResolver()
	async assigned(@Root() task: Task): Promise<User[]> {
		let assigned: User[] = [];
		for (let userId of task._doc.assigned) {
			let user = await UserModel.findById(userId);
			if (user) {
				assigned.push(user);
			}
		}
		return assigned;
	}
}
