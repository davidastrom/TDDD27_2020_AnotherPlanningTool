import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { List } from '../entities/list';

import { Board, BoardModel } from '../entities/board';
import { Task, TaskModel } from '../entities/task';
import { TaskInput } from './types/task-input';

@Resolver((of) => List)
export class ListResolver {
	@Mutation((returns) => Board)
	async addTask(@Arg('task') taskInput: TaskInput) {
		const board = await BoardModel.findById(taskInput.boardId);
		if (!board) {
			throw new Error('Invalid Board id');
		}

		const list = board.lists.find(
			(list) => list._id.toHexString() == taskInput.listId.toHexString(),
		);
		if (!list) {
			throw new Error('Invalid List id');
		}

		const task = new TaskModel({
			title: taskInput.title,
			description: taskInput.description,
		} as Task);

		list.items.push(task);

		await board.save();

		return list;
	}
}
