import { ObjectType, Field, ID } from 'type-graphql';
import {
	prop as Property,
	arrayProp as ArrayProperty,
	getModelForClass,
} from '@typegoose/typegoose';
import { Ref } from '../types';

import { Team } from './Team';
import { Board } from './Board';

@ObjectType({ description: 'The User model' })
export class User {
	@Field((_type) => ID)
	readonly id!: String;

	@Field()
	@Property({ required: true, unique: true })
	email!: String;

	@Field((_type) => [Team])
	@ArrayProperty({ items: Team, default: [] })
	teams!: Team[];

	@Field((_type) => [Board])
	@ArrayProperty({ items: Board, default: [] })
	boards!: Board[];
}

export const UserModel = getModelForClass(User);
