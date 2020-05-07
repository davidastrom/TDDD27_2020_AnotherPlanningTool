import { ObjectType, Field, ID } from 'type-graphql';
import {
	prop as Property,
	arrayProp as ArrayProperty,
	getModelForClass,
} from '@typegoose/typegoose';
import { Ref } from '../types';

import { Board } from './Board';
import { User } from './User';

@ObjectType({ description: 'The List item model. Subitem for' })
export class ListItem {
	@Field((type) => ID)
	readonly id!: String;

	@Field()
	@Property({ required: true })
	name!: String;

	@Field({ nullable: true })
	@Property()
	description?: String;

	@Field((type) => [User])
	@ArrayProperty({ ref: 'User' })
	assigned!: Ref<User>[];
}

@ObjectType({ description: 'The List model' })
export class List {
	@Field((type) => ID)
	readonly id!: String;

	@Field()
	@Property({ required: true })
	name!: String;

	@Field((type) => [ListItem])
	@ArrayProperty({ items: ListItem })
	items!: ListItem[];
}

export const ListModel = getModelForClass(List);
