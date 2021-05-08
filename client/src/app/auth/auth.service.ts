import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { GetCurrentUserGQL, User } from '../services/graphql.service';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	googleLoginUrl = '/auth/google';

	redirectUrl: string;

	constructor(
		private http: HttpClient,
		private router: Router,
		private currentUserService: GetCurrentUserGQL
	) {}

	googleLogin() {
		window.location.href = this.googleLoginUrl;
	}

	getCurrentUser() {
		return this.currentUserService
			.fetch()
			.pipe(map((res) => res.data.currentUser));
	}

	isLoggedIn(): Observable<boolean> {
		return this.getCurrentUser().pipe(
			map((user) => {
				if (user == null) return false;
				return true;
			})
		);
	}
}
