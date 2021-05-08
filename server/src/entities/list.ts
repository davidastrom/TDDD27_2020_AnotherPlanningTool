import { ObjectType, Field, ID } from 'type-graphql';
import {
	prop as Property,
	arrayProp as ArrayProperty,
	getModelForClass,
} from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';

import { Ref } from '../types';

import { Task } from './task';

@ObjectType({ description: 'The List model. Submodel for Board' })
export class List {
	@Field((type) => ID)
	readonly _id!: ObjectId;

	@Field()
	@Property({ required: true })
	name!: string;

	@Field((type) => [Task])
	@ArrayProperty({ items: Task })
	items!: Task[];

	_doc!: any;
}

export const ListModel = getModelForClass(List);
