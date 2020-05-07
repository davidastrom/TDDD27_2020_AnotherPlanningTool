import { InputType, Field, ID } from 'type-graphql';
import { Length } from 'class-validator';
import { List } from '../../models/List';

@InputType()
export class ListInput implements Partial<List> {
	@Field()
	@Length(1, 127)
	name!: String;
}
