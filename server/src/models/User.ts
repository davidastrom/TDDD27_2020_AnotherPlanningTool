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
	@Field((type) => ID)
	readonly id!: String;

	@Field()
	@Property({ required: true, unique: true })
	email!: String;

	@Field((type) => [Team])
	@ArrayProperty({ ref: 'Team' })
	teams!: Ref<Team>[];

	@Field((type) => [Board])
	@ArrayProperty({ ref: 'Board' })
	boards!: Ref<Board>[];
}

export const UserModel = getModelForClass(User);
