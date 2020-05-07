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
	@Field((type) => ID)
	readonly id!: String;

	@Field()
	@Property({ required: true })
	name!: String;

	@Field((type) => Team, { nullable: true })
	@Property({ ref: 'Team' })
	team?: Ref<Team>;

	@Field((type) => [User])
	@ArrayProperty({ ref: 'User' })
	members?: Ref<User>[];
}

export const BoardModel = getModelForClass(Board);
