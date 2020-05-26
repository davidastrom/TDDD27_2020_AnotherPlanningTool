import { ObjectType, Field, ID } from 'type-graphql';
import {
	prop as Property,
	arrayProp as ArrayProperty,
	getModelForClass,
} from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';

import { Ref } from '../types';

import { User } from './user';
import { Board } from './board';

@ObjectType({ description: 'The Team model' })
export class Team {
	@Field((type) => ID)
	readonly _id!: ObjectId;

	@Field()
	@Property({ required: true })
	name!: string;

	@Field((type) => [User])
	@ArrayProperty({ ref: 'User' })
	members!: Ref<User>[];

	@Field((type) => [Board])
	@ArrayProperty({ ref: 'Board' })
	boards!: Ref<Board>[];

	_doc: any;
}

export const TeamModel = getModelForClass(Team);
