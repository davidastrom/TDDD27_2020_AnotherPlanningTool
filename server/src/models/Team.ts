import { ObjectType, Field, ID } from 'type-graphql';
import {
	prop as Property,
	arrayProp as ArrayProperty,
	getModelForClass,
} from '@typegoose/typegoose';
import { Ref } from '../types';

import { User } from './User';
import { Board } from './Board';

@ObjectType({ description: 'The Team model' })
export class Team {
	@Field((_type) => ID)
	readonly id!: String;

	@Field()
	@Property({ required: true })
	name!: String;

	@Field((_type) => [User])
	@ArrayProperty({ items: User, default: [] })
	members!: User[];

	@Field((_type) => [Board])
	@ArrayProperty({ items: Board, default: [] })
	boards!: Board[];
}

export const TeamModel = getModelForClass(Team);
