import {
	Resolver,
	Query,
	Mutation,
	Arg,
	FieldResolver,
	Root,
	Int,
	Ctx,
	Authorized,
} from 'type-graphql';
import { ObjectId } from 'mongodb';

import { ObjectIdScalar } from '../object-id.scalar';

import { Board, BoardModel } from '../entities/board';
import { BoardInput } from './types/board-input';

import { Team, TeamModel } from '../entities/team';
import { User, UserModel } from '../entities/user';
import { List, ListModel } from '../entities/list';
import { ListInput } from './types/list-input';
import { AuthenticationError, UserInputError, ForbiddenError } from 'apollo-server-errors';
import { Context } from '../interfaces/context';

@Resolver((of) => Board)
export class BoardResolver {
	@Authorized()
	@Query((returns) => Board)
	async board(@Arg('boardId', (type) => ObjectIdScalar) boardId: ObjectId, @Ctx() { user }: Context) {
		const board = await BoardModel.findById(boardId);
		if (!board) {
			throw new UserInputError('Invalid Board ID provided');
		}

		if (!board.isMember(user._id)) {
			throw new ForbiddenError("Not authorized to view resource");
		}
		
		return board;
	}

	// @Query((returns) => [Board])
	// async allBoards() {
	// 	return await BoardModel.find();
	// }

	@Authorized()
	@Mutation((returns) => Board)
	async createBoard(
		@Arg('board') boardInput: BoardInput,
		@Arg('teamId', (type) => ObjectIdScalar, { nullable: true }) teamId: ObjectId,
		@Ctx() { user }: Context
	): Promise<Board> {		
		let team;
		if (teamId) {
			team = await TeamModel.findById(teamId);
			if (!team) {
				throw new UserInputError("Invalid Team ID provided");
			}
		}
		const board = teamId ? new BoardModel({
				name: boardInput.name,
				team: teamId
			} as Board) : 
			new BoardModel({
				name: boardInput.name,
				members: [user._id]
			} as Board);

		const toDoList = new ListModel({
			name: 'To Do',
			items: [],
		} as unknown as List);

		const inProgressList = new ListModel({
			name: 'In Progress',
			items: [],
		} as unknown as List);

		const doneList = new ListModel({
			name: 'Done',
		} as unknown as List);

		board.lists.push(toDoList);
		board.lists.push(inProgressList);
		board.lists.push(doneList);

		await board.save();

		if (team) {
			team.boards.push(board._id);
			await team.save();
		} else {
			user.boards.push(board._id)
			await user.save();
		}

		return board;
	}

	@Authorized()
	@Mutation(() => Board)
	async addBoardMember(
		@Arg('boardId', (type) => ObjectIdScalar) boardId: ObjectId,
		@Arg('userId', (type) => ObjectIdScalar) userId: ObjectId,
		@Ctx() { user }: Context
	) {
		const board = await BoardModel.findById(boardId);
		if (!board) {
			throw new UserInputError('Invalid Board ID');
		}

		if (!board.isMember(user._id)) {
			throw new ForbiddenError("Not authorized to view resource");
		}

		const userModel = await UserModel.findById(userId);
		if (!userModel) {
			throw new UserInputError('Invalid User ID');
		}

		let userInMember: boolean = false;

		for (let id of board.members) {
			if (id.toString() == userModel._id.toString()) {
				userInMember = true;
			}
		}
		if (!userInMember) {
			board.members.push(userModel._id);
			userModel.boards.push(board._id);
			await board.save();
			await userModel.save();
		}

		return board;
	}

	@Authorized()
	@Mutation(() => Board)
	async removeBoardMember(
		@Arg('boardId', (type) => ObjectIdScalar) boardId: ObjectId,
		@Arg('userId', (type) => ObjectIdScalar) userId: ObjectId,
		@Ctx() { user }: Context
	) {
		const board = await BoardModel.findById(boardId);
		if (!board) {
			throw new UserInputError('Invalid Board ID');
		}

		if (!board.isMember(user._id)) {
			throw new ForbiddenError("Not authorized to view resource");
		}

		const userModel = await UserModel.findById(userId);
		if (!userModel) {
			throw new UserInputError('Invalid User ID');
		}

		for (let i = 0; i < board.members.length; i++) {
			if (board.members[i].toString() == userModel._id.toString()) {
				board.members.splice(i, 1);
				await board.save();
				break;
			}
		}
		for (let i = 0; i < userModel.boards.length; i++) {
			if (userModel.boards[i].toString() == board._id.toString()) {
				userModel.boards.splice(i, 1);
				await userModel.save();
				break;
			}
		}
		return board;
	}

	@Authorized()
	@Mutation((returns) => List)
	async addList(
		@Arg('list') listInput: ListInput,
		@Ctx() { user }: Context
	) {
		const board = await BoardModel.findById(listInput.boardId);
		if (!board) {
			throw new Error('Invalid Board id');
		}

		if (!board.isMember(user._id)) {
			throw new ForbiddenError("Not authorized to view resource");
		}

		const list = new ListModel({
			name: listInput.name,
		} as List);

		board.lists.push(list);

		return await board.save();
	}

	@Authorized()
	@Mutation((returns) => Board)
	async moveList(
		@Arg('boardId', (type) => ObjectIdScalar) boardId: ObjectId,
		@Arg('listId', (type) => ObjectIdScalar) listId: ObjectId,
		@Arg('index', (type) => Int) index: number,
		@Ctx() { user }: Context
	) {
		const board = await BoardModel.findById(boardId);
		if (!board) {
			throw new UserInputError('Invalid Board id');
		}

		if (!board.isMember(user._id)) {
			throw new ForbiddenError("Not authorized to view resource");
		}

		const listIndex = board.lists.findIndex(
			(list) => list._id.toHexString() == listId.toHexString()
		);
		if (!listIndex) {
			throw new UserInputError('Invalid List id');
		}

		const list = board.lists.splice(listIndex, 1)[0];
		board.lists.splice(index, 0, list);
		return await board.save();
	}

	@Authorized()
	@Mutation((returns) => Board)
	async moveTask(
		@Arg('boardId', (type) => ObjectIdScalar) boardId: ObjectId,
		@Arg('startListId', (type) => ObjectIdScalar) startId: ObjectId,
		@Arg('goalListId', (type) => ObjectIdScalar) goalId: ObjectId,
		@Arg('taskId', (type) => ObjectIdScalar) taskId: ObjectId,
		@Arg('index', (type) => Int) index: number,
		@Ctx() { user }: Context
	) {
		const board = await BoardModel.findById(boardId);
		if (!board) {
			throw new UserInputError('Invalid Board id');
		}

		if (!board.isMember(user._id)) {
			throw new ForbiddenError("Not authorized to view resource");
		}

		const startList = board.lists.find(
			(list) => list._id.toHexString() == startId.toHexString()
		);
		if (!startList) {
			throw new UserInputError('Invalid Startlist id');
		}

		const goalList = board.lists.find(
			(list) => list._id.toHexString() == goalId.toHexString()
		);
		if (!goalList) {
			throw new UserInputError('Invalid Goallist id');
		}

		const startIndex = startList.items.findIndex(
			(task) => task._id.toHexString() == taskId.toHexString()
		);
		if (!startIndex) {
			throw new UserInputError('Invalid Task id');
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
