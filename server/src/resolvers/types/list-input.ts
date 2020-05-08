import { InputType, Field, ID } from 'type-graphql';
import { Length } from 'class-validator';
import { ObjectId } from 'mongodb';
import { List } from '../../entities/list';

@InputType()
export class ListInput implements Partial<List> {
	@Field()
	@Length(1, 127)
	name!: String;

	@Field((type) => ID)
	boardId!: ObjectId;
}
