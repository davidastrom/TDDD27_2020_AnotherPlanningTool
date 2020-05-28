import passport from 'passport';
import {
	OAuth2Strategy as GoogleStrategy,
	Profile,
	VerifyFunction,
} from 'passport-google-oauth';
import { UserModel, User } from './entities/user';

export const passportSetup = () => {
	const GoogleStrategyCallback = async (
		access_token: string,
		refresh_token: string,
		profile: Profile,
		done: VerifyFunction
	) => {
		try {
			let user = await UserModel.getOrCreateGoogleUser(profile);
			user.token = await user.generateJWT();
			done(null, user);
		} catch (e) {
			done(e);
		}
	};

	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID || '',
				clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
				callbackURL: 'http://localhost:8080/auth/google/callback',
			},
			GoogleStrategyCallback
		)
	);

	passport.serializeUser((user: User, done) => {
		done(null, user._id);
	});

	passport.deserializeUser((id: string, done) => {
		try {
			let user = UserModel.getById(id);
			done(null, user);
		} catch (e) {
			done(e);
		}
	});
};
