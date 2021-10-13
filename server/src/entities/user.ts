import { ObjectType, Field, ID } from 'type-graphql';
import {
	prop as Property,
	arrayProp as ArrayProperty,
	getModelForClass,
	ReturnModelType,
} from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';

import { Ref } from '../interfaces/types';

import { Team } from './team';
import { Board } from './board';
import jsonwebtoken from 'jsonwebtoken';
import { TokenPayload } from 'google-auth-library';
import env from '../environments/environmentConfig';

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

	@Field({ nullable: true })
	@Property()
	picture?: string;

	@Field((type) => [Team])
	@ArrayProperty({ ref: 'Team', default: [] })
	teams!: Ref<Team>[];

	@Field((type) => [Board])
	@ArrayProperty({ ref: 'Board', default: [] })
	boards!: Ref<Board>[];

	@Property({ unique: true })
	googleProfileId: string | undefined;

	token?: string;

	_doc?: any;

	public async generateJWT(this: User) {
		let token = jsonwebtoken
			.sign(
				{
					id: this._id.toHexString(),
				},
				env.auth.jwt.secret,
				{
					expiresIn: '7 days',
				}
			)
			.toString();
		return token;
	}

	public static async getById(this: ReturnModelType<typeof User>, id: string) {
		return await this.findById(id).exec();
	}

	public static async getByToken(
		this: ReturnModelType<typeof User>,
		token: string
	) {
		try {
			let decoded = jsonwebtoken.verify(token, env.auth.jwt.secret) as {
				id: string;
			};
			return await this.getById(decoded.id);
		} catch (error) {
			throw error;
		}
	}

	public static async getOrCreateGoogleUser(
		this: ReturnModelType<typeof User>,
		profile: TokenPayload
	) {
		try {
			let user = await this.findOne({ googleProfileId: profile.sub }).exec();

			if (user) {
				return user;
			}

			user = await this.findOne({ email: profile.email }).exec();

			if (user) {
				user.googleProfileId = profile.sub;
				await user.save();
				return user;
			}

			let newUser = new this({
				username: profile.name,
				email: profile.email,
				googleProfileId: profile.sub,
				picture: profile.picture,
			});

			newUser.save();
			return newUser;
		} catch (e) {
			console.log(e);
		}
	}
}

export const UserModel = getModelForClass(User);
