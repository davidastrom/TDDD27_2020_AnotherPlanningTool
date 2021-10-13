import { InputType, Field, ID, ArgsType } from 'type-graphql';
import { Length } from 'class-validator';
import { Board } from '../../entities/board';
import { ObjectId } from 'mongodb';

@InputType()
export class BoardInput implements Partial<Board> {
	@Field()
	@Length(1, 127)
	name!: string;
}

@ArgsType()
export class BoardListsArgs {
	@Field((type) => ID)
	boardId!: ObjectId;
}
