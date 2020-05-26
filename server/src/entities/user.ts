import { ObjectType, Field, ID } from 'type-graphql';
import {
	prop as Property,
	arrayProp as ArrayProperty,
	getModelForClass,
} from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';

import { Ref } from '../types';

import { Team } from './team';
import { Board } from './board';

@ObjectType({ description: 'The User model' })
export class User {
	@Field((type) => ID)
	readonly _id!: ObjectId;

	@Field()
	@Property({ required: true, unique: true })
	email!: string;

	@Field((type) => [Team])
	@ArrayProperty({ ref: 'Team' })
	teams!: Ref<Team>[];

	@Field((type) => [Board])
	@ArrayProperty({ ref: 'Board' })
	boards!: Ref<Board>[];

	_doc: any;
}

export const UserModel = getModelForClass(User);
