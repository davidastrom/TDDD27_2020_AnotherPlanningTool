import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { User, UserModel } from '../entities/user';
import env from '../environments/environmentConfig';

export default class GoogleAuthConfig {
	private client = new OAuth2Client(
		env.auth.google.clientId,
		env.auth.google.clientSecret
	);

	private async validateToken(
		token: string
	): Promise<TokenPayload | undefined> {
		const ticket = await this.client.verifyIdToken({
			idToken: token,
			audience: env.auth.google.clientId,
		});
		return ticket.getPayload();
	}

	public async signIn(token: string): Promise<User | undefined> {
		const payload = await this.validateToken(token);

		if (!payload) {
			return;
		}

		const user = await UserModel.getOrCreateGoogleUser(payload);
		return user;
	}
}
