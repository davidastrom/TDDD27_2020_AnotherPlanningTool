import { ObjectType, Field, ID } from 'type-graphql';
import { prop as Property, getModelForClass } from '@typegoose/typegoose';

@ObjectType({ description: "The User model"})
export class User {
    @Field(_type => ID)
    readonly id!: String;

    @Field()
    @Property({ required: true, unique: true })
    email!: String;
}

export const UserModel = getModelForClass(User);