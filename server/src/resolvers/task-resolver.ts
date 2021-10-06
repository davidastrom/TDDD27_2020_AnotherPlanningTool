import { Resolver, Mutation, Root, FieldResolver, Arg, Ctx, Authorized } from 'type-graphql';
import { ObjectId } from 'mongodb';
import { ObjectIdScalar } from '../object-id.scalar';
import { Task } from '../entities/task';

import { User, UserModel } from '../entities/user';
import { Board, BoardModel } from '../entities/board';
import { Team, TeamModel } from '../entities/team';
import { Context } from '../interfaces/context';
import { AuthenticationError, UserInputError } from 'apollo-server-errors';

@Resolver((of) => Task)
export class TaskResolver {
	@Authorized()
	@Mutation((returns) => Task)
	async assignUser(
		@Arg('boardId', (type) => ObjectIdScalar) boardId: ObjectId,
		@Arg('listId', (type) => ObjectIdScalar) listId: ObjectId,
		@Arg('taskId', (type) => ObjectIdScalar) taskId: ObjectId,
		@Arg('userId', (tyep) => ObjectIdScalar) userId: ObjectId,
		@Ctx() { user }: Context
	) {		
		const board = await BoardModel.findById(boardId);
		if (!board) {
			throw new UserInputError('Invalid Board id');
		}


		if (!board.isMember(userId)) {
			throw new UserInputError("User not member of board");
		}

		const list = board.lists.find(
			(list) => list._id.toHexString() == listId.toHexString(),
		);
		if (!list) {
			throw new UserInputError('Invalid List id');
		}

		const task = list.items.find(
			(task) => task._id.toHexString() == taskId.toHexString(),
		);
		if (!task) {
			throw new UserInputError('Invalid Task id');
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
