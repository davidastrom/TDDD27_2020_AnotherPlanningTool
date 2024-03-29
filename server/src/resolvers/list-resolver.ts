import {
	Resolver,
	Query,
	Mutation,
	Arg,
	Ctx,
	Authorized,
	PubSub,
	Publisher,
} from 'type-graphql';
import { List } from '../entities/list';

import { Board, BoardModel } from '../entities/board';
import { Task, TaskModel } from '../entities/task';
import { TaskInput } from './input-models/task-input';
import { Context } from '../interfaces/context';
import {
	AuthenticationError,
	ForbiddenError,
	UserInputError,
} from 'apollo-server-errors';

@Resolver((of) => List)
export class ListResolver {
	@Authorized()
	@Mutation((returns) => Board)
	async addTask(
		@Arg('task') taskInput: TaskInput,
		@Ctx() { user }: Context,
		@PubSub('LISTS') publish: Publisher<Board>
	) {
		const board = await BoardModel.findById(taskInput.boardId);
		if (!board) {
			throw new UserInputError('Invalid Board id');
		}

		if (!board.isMember(user._id)) {
			throw new ForbiddenError('Not authorized to view resource');
		}

		const list = board.lists.find(
			(list) => list._id.toString() == taskInput.listId.toString()
		);
		if (!list) {
			throw new UserInputError('Invalid List id');
		}

		const task = new TaskModel({
			title: taskInput.title,
			description: taskInput.description,
		} as Task);

		list.items.push(task);

		await board.save();

		await publish(board);

		return list;
	}
}
