import { ObjectType, Field, ID } from 'type-graphql';
import {
	prop as Property,
	arrayProp as ArrayProperty,
	getModelForClass,
} from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';

import { Ref } from '../interfaces/types';

import { User } from './user';

@ObjectType({ description: 'The Task model. Submodel of List' })
export class Task {
	@Field((type) => ID)
	readonly _id!: ObjectId;

	@Field()
	@Property({ required: true })
	title!: string;

	@Field({ nullable: true })
	@Property()
	description?: string;

	@Field((type) => User, { nullable: true })
	@Property({ ref: 'User' })
	assigned?: Ref<User>;

	_doc: any;
}

export const TaskModel = getModelForClass(Task);
