import {
	Resolver,
	Query,
	Mutation,
	Arg,
	FieldResolver,
	Root,
	Int,
} from 'type-graphql';
import { ObjectId } from 'mongodb';

import { ObjectIdScalar } from '../object-id.scalar';

import { Board, BoardModel } from '../entities/board';
import { BoardInput } from './types/board-input';

import { Team, TeamModel } from '../entities/team';
import { User, UserModel } from '../entities/user';
import { List, ListModel } from '../entities/list';
import { ListInput } from './types/list-input';

@Resolver((of) => Board)
export class BoardResolver {
	@Query((returns) => Board, { nullable: true })
	async board(@Arg('boardId', (type) => ObjectIdScalar) boardId: ObjectId) {
		return await BoardModel.findById(boardId);
	}

	@Query((returns) => [Board])
	async allBoards() {
		return await BoardModel.find();
	}

	@Mutation((returns) => Board)
	async createBoard(
		@Arg('board') boardInput: BoardInput,
		@Arg('teamId', (type) => ObjectIdScalar, { nullable: true })
		teamId: ObjectId,
	): Promise<Board> {
		const board = new BoardModel({
			...boardInput,
			team: teamId,
		} as Board);

		const toDoList = new ListModel(({
			name: 'To Do',
			items: [],
		} as unknown) as List);

		const inProgressList = new ListModel(({
			name: 'In Progress',
			items: [],
		} as unknown) as List);

		const doneList = new ListModel(({
			name: 'Done',
		} as unknown) as List);

		board.lists.push(toDoList);
		board.lists.push(inProgressList);
		board.lists.push(doneList);

		return await board.save();
	}

	@Mutation((returns) => List)
	async addList(@Arg('list') listInput: ListInput) {
		const board = await BoardModel.findById(listInput.boardId);
		if (!board) {
			throw new Error('Invalid Board id');
		}

		const list = new ListModel({
			name: listInput.name,
		} as List);

		board.lists.push(list);

		return await board.save();
	}

	@Mutation((returns) => Board)
	async moveList(
		@Arg('boardId', (type) => ObjectIdScalar) boardId: ObjectId,
		@Arg('listId', (type) => ObjectIdScalar) listId: ObjectId,
		@Arg('index', (type) => Int) index: number,
	) {
		const board = await BoardModel.findById(boardId);
		if (!board) {
			throw new Error('Invalid Board id');
		}

		const listIndex = board.lists.findIndex(
			(list) => list._id.toHexString() == listId.toHexString(),
		);
		if (!listIndex) {
			throw new Error('Invalid List id');
		}

		const list = board.lists.splice(listIndex, 1)[0];
		board.lists.splice(index, 0, list);
		return await board.save();
	}

	@Mutation((returns) => Board)
	async moveTask(
		@Arg('boardId', (type) => ObjectIdScalar) boardId: ObjectId,
		@Arg('startListId', (type) => ObjectIdScalar) startId: ObjectId,
		@Arg('goalListId', (type) => ObjectIdScalar) goalId: ObjectId,
		@Arg('taskId', (type) => ObjectIdScalar) taskId: ObjectId,
		@Arg('index', (type) => Int) index: number,
	) {
		const board = await BoardModel.findById(boardId);
		if (!board) {
			throw new Error('Invalid Board id');
		}

		const startList = board.lists.find(
			(list) => list._id.toHexString() == startId.toHexString(),
		);
		if (!startList) {
			throw new Error('Invalid Startlist id');
		}

		const goalList = board.lists.find(
			(list) => list._id.toHexString() == goalId.toHexString(),
		);
		if (!goalList) {
			throw new Error('Invalid Goallist id');
		}

		const startIndex = startList.items.findIndex(
			(task) => task._id.toHexString() == taskId.toHexString(),
		);
		if (!startIndex) {
			throw new Error('Invalid Task id');
		}

		const task = startList.items.splice(startIndex, 1)[0];

		goalList.items.splice(index, 0, task);

		return await board.save();
	}

	@FieldResolver({ nullable: true })
	async team(@Root() board: Board) {
		return await TeamModel.findById(board._doc.team);
	}

	@FieldResolver()
	async members(@Root() board: Board): Promise<User[]> {
		let members: User[] = [];
		for (let userId of board._doc.members) {
			let user = await UserModel.findById(userId);
			if (user) {
				members.push(user);
			}
		}
		return members;
	}
}
