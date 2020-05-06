import { ObjectType, Field, ID } from 'type-graphql';
import {
	prop as Property,
	arrayProp as ArrayProperty,
	getModelForClass,
} from '@typegoose/typegoose';
import { Ref } from '../types';

import { Team } from './Team';
import { User } from './User';

@ObjectType({ description: 'The Board model' })
export class Board {
	@Field((_type) => ID)
	readonly id!: String;

	@Field()
	@Property({ required: true, unique: true })
	name!: String;

	@Field((_type) => Team, { nullable: true })
	@Property({ ref: Team })
	team?: Ref<Team>;

	@Field((_type) => [User])
	@ArrayProperty({ items: User, default: [] })
	members?: User[];
}

export const BoardModel = getModelForClass(Board);
