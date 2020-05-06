import { InputType, Field, ID } from 'type-graphql';
import { Length, IsEmail } from 'class-validator';
import { User } from '../../models/User';

@InputType()
export class UserInput implements Partial<User> {
    @Field()
    @IsEmail()
    email!: String;
}