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
import { Provider } from './provider';
import { Profile } from 'passport-google-oauth';
import jsonwebtoken from 'jsonwebtoken';

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

	@ArrayProperty({ items: Provider, _id: false })
	providers!: Provider[];

	token?: string;

	_doc?: any;

	public async generateJWT(this: User) {
		let token = jsonwebtoken
			.sign(
				{
					id: this._id.toHexString,
				},
				process.env.JWT_SECRET || 'super secret',
				{
					expiresIn: '7 days',
				}
			)
			.toString();

		return token;
	}

	public static async getById(
		this: ReturnModelType<typeof User>,
		id: string
	) {
		return await this.findById(id);
	}

	public static async getOrCreateGoogleUser(
		this: ReturnModelType<typeof User>,
		profile: Profile
	) {
		try {
			let type = profile.provider;
			let id = profile.id;

			let user = await this.findOne({
				providers: {
					$elemMatch: { type: type, id: id },
				},
			});

			if (user) {
				return user;
			}

			user = await this.findOne({ email: profile._json.email });

			if (user) {
				user.providers.push({
					id: profile.id,
					type: profile.provider,
				});
				await user.save();
				return user;
			}

			let newUser = new this({
				username: profile.displayName,
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
