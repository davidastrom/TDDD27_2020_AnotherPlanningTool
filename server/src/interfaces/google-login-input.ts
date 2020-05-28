import { Profile, VerifyFunction } from 'passport-google-oauth';

export interface GoogleLoginInput {
	access_token?: string;
	refresh_token?: string;
	profile?: Profile;
	done?: VerifyFunction;
}
