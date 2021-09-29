export interface UserProfile {
	_id: string;
	username: string;
	email: string;
	googleProfileId?: string;
	boards: string[];
	teams: string[];
}
