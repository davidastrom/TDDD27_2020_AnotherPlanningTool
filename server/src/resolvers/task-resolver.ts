import {
	Resolver,
	Mutation,
	Root,
	FieldResolver,
	Arg,
	Ctx,
	Authorized,
	PubSub,
	Publisher,
} from 'type-graphql';
import { ObjectId } from 'mongodb';
import { ObjectIdScalar } from '../object-id.scalar';
import { Task } from '../entities/task';

import { User, UserModel } from '../entities/user';
import { Board, BoardModel } from '../entities/board';
import { Team, TeamModel } from '../entities/team';
import { Context } from '../interfaces/context';
import { AuthenticationError, UserInputError } from 'apollo-server-errors';
import { AssignUserInput } from './input-models/task-input';

@Resolver((of) => Task)
export class TaskResolver {
	@Authorized()
	@Mutation((returns) => Task)
	async assignUser(
		@Arg('input') input: AssignUserInput,
		@Ctx() { user }: Context,
		@PubSub('LISTS') publish: Publisher<Board>
	) {
		const board = await BoardModel.findById(input.boardId);
		if (!board) {
			throw new UserInputError('Invalid Board id');
		}

		if (input.userId) {
			if (!board.isMember(input.userId)) {
				throw new UserInputError('User not member of board');
			}
		}

		const list = board.lists.find(
			(list) => list._id.toString() == input.listId.toString()
		);
		if (!list) {
			throw new UserInputError('Invalid List id');
		}

		const task = list.items.find(
			(task) => task._id.toString() == input.taskId.toString()
		);
		if (!task) {
			throw new UserInputError('Invalid Task id');
		}

		task.assigned = input.userId;

		await board.save();

		publish(board);

		return task;
	}

	@FieldResolver({ nullable: true })
	async assigned(@Root() task: Task) {
		return await UserModel.findById(task._doc.assigned);
	}
}
