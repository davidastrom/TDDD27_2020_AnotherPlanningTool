import { ObjectType, Field, ID } from 'type-graphql';
import {
	prop as Property,
	arrayProp as ArrayProperty,
	getModelForClass,
	ReturnModelType,
} from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';

import { Ref } from '../types';

import { Team } from './team';
import { Board } from './board';
import { GoogleLoginInput } from '../interfaces/google-login-input';
import { Provider } from './provider';
import { Profile } from 'passport-google-oauth';

@ObjectType({ description: 'The User model' })
export class User {
	@Field((type) => ID)
	readonly _id!: ObjectId;

	@Field()
	@Property({ required: true })
	username!: string;

	@Field()
	@Property({ required: true, unique: true })
	email!: string;

	@Field((type) => [Team])
	@ArrayProperty({ ref: 'Team', default: [] })
	teams!: Ref<Team>[];

	@Field((type) => [Board])
	@ArrayProperty({ ref: 'Board', default: [] })
	boards!: Ref<Board>[];

	@Property({ _id: false, select: false })
	providers!: Provider[];

	_doc?: any;

	public static async getOrCreateGoogleUser(
		this: ReturnModelType<typeof User>,
		profile: Profile
	) {
		try {
			let user = await this.findOne({ google_id: profile.id }).exec();

			if (user) {
				user.providers.push({
					id: profile.id,
					type: profile.provider,
				});
				await user.save();
				return user;
			}

			user = await this.findOne({ email: profile._json.email }).exec();

			if (user) {
				user.providers.push({
					id: profile.id,
					type: profile.provider,
				});
				await user.save();
				return user;
			}

			let newUser = new this({
				username: profile.name,
				email: profile._json.email,
			});

			newUser.providers.push({
				id: profile.id,
				type: profile.provider,
			});

			newUser.save();
			return newUser;
		} catch (e) {
			throw Error(e);
		}
	}
}

export const UserModel = getModelForClass(User);
