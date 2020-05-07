import { InputType, Field, ID } from 'type-graphql';
import { Length, MaxLength } from 'class-validator';
import { ListItem } from '../../models/List';

@InputType()
export class ListItemInput implements Partial<ListItem> {
	@Field()
	@Length(1, 127)
	name!: String;

	@Field({ nullable: true })
	@MaxLength(255)
	description?: String;
}
