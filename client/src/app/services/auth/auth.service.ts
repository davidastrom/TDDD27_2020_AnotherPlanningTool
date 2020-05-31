import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	googleLoginUrl = 'auth/google';

	constructor(private http: HttpClient) {}

	googleLogin() {
		return this.http.get(this.googleLoginUrl);
	}
}
