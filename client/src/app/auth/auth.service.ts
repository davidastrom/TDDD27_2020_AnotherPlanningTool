import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	googleLoginUrl = '/auth/google';

	constructor(private http: HttpClient, private router: Router) {}

	googleLogin() {
		window.location.href = this.googleLoginUrl;
	}
}
