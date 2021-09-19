import { OAuth2Client, TokenPayload } from "google-auth-library";

export default class GoogleAuthConfig {
    private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

    public async validateToken(token: string) : Promise<TokenPayload | undefined> {
        const ticket = await this.client.verifyIdToken({idToken: token, audience: process.env.GOOGLE_CLIENT_ID})
        return ticket.getPayload();
    }
}
