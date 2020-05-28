export interface TokenUser extends Express.User {
	id?: string;
	token?: string;
}
