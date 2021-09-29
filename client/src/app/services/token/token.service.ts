import { Injectable } from '@angular/core';

const AUTH_KEY = 'apt-auth-token';

@Injectable({
	providedIn: 'root',
})
export class TokenService {
	constructor() {}

	clearToken() {
		window.localStorage.removeItem(AUTH_KEY);
	}

	saveToken(token: string) {
		window.localStorage.removeItem(AUTH_KEY);
		window.localStorage.setItem(AUTH_KEY, token);
	}

	getToken(): string | null {
		return window.localStorage.getItem(AUTH_KEY);
	}
}
