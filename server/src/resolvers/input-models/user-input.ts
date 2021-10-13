import { InputType, Field, ID } from 'type-graphql';
import { Length, IsEmail } from 'class-validator';
import { User } from '../../entities/user';

@InputType()
export class UserInput implements Partial<User> {
	@Field()
	@IsEmail()
	email!: string;
}
