import { InputType, Field, ID } from 'type-graphql';
import { Length, MaxLength } from 'class-validator';
import { ObjectId } from 'mongodb';
import { Task } from '../../entities/task';

@InputType()
export class TaskInput implements Partial<Task> {
	@Field()
	@Length(1, 127)
	title!: String;

	@Field({ nullable: true })
	@MaxLength(255)
	description?: String;

	@Field((type) => ID)
	listId!: ObjectId;

	@Field((type) => ID)
	boardId!: ObjectId;
}
