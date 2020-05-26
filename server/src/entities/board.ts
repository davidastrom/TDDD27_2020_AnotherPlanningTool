import { ObjectType, Field, ID } from 'type-graphql';
import {
	prop as Property,
	arrayProp as ArrayProperty,
	getModelForClass,
} from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';

import { Ref } from '../types';

import { Team } from './team';
import { User } from './user';
import { List } from './list';

@ObjectType({ description: 'The Board model' })
export class Board {
	@Field()
	readonly _id!: ObjectId;

	@Field()
	@Property({ required: true })
	name!: string;

	@Field((type) => Team, { nullable: true })
	@Property({ ref: 'Team' })
	team?: Ref<Team>;

	@Field((type) => [User])
	@ArrayProperty({ ref: 'User' })
	members!: Ref<User>[];

	@Field((type) => [List])
	@ArrayProperty({ items: List })
	lists!: List[];

	_doc: any;
}

export const BoardModel = getModelForClass(Board);
