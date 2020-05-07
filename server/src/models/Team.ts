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
	@Field((type) => ID)
	readonly id!: String;

	@Field()
	@Property({ required: true })
	name!: String;

	@Field((type) => [User])
	@ArrayProperty({ ref: 'User' })
	members!: Ref<User>[];

	@Field((type) => [Board])
	@ArrayProperty({ ref: 'Board' })
	boards!: Ref<Board>[];
}

export const TeamModel = getModelForClass(Team);
