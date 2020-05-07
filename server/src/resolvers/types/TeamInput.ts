import { InputType, Field, ID } from 'type-graphql';
import { Length } from 'class-validator';
import { Team } from '../../models/Team';

@InputType()
export class TeamInput implements Partial<Team> {
	@Field()
	@Length(1, 127)
	name!: String;
}
