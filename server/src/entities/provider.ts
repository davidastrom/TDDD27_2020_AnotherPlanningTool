import { prop as Property } from '@typegoose/typegoose';

export class Provider {
	@Property()
	type!: string;

	@Property()
	id!: string;
}
