import { Resolver, Query, Mutation, Arg } from 'type-graphql';
import { User, UserModel } from '../models/User';
import { UserInput } from './types/UserInput';

@Resolver()
export class UserResolver {
	@Query((_returns) => User, { nullable: false })
	async returnSingleUser(@Arg('id') id: string) {
		return await UserModel.findById({ _id: id });
    }
    
    @Query((_returns) => [User])
    async returnAllUsers() {
        return await UserModel.find();
    }

    @Mutation(() => User)
    async createUser(@Arg("data"){email}: UserInput): Promise<User> {
        const user = (await UserModel.create({
            email,
        })).save();
        return user;
    }
}
