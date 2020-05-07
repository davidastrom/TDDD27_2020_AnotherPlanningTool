import { InputType, Field, ID } from 'type-graphql';
import { Length } from 'class-validator';
import { Board } from '../../models/Board';

@InputType()
export class BoardInput implements Partial<Board> {
	@Field()
	@Length(1, 127)
	name!: String;
}
