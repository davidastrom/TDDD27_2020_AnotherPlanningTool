import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, first, retry, take } from 'rxjs/operators';
import { TokenService } from '../token/token.service';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
@Injectable({
	providedIn: 'root',
})
export class AuthService {
	private _signedIn = new BehaviorSubject<boolean>(false);

	public signedIn$ = this._signedIn.asObservable();

	public redirectUrl = '/';

	constructor(
		private socialAuthService: SocialAuthService,
		private http: HttpClient,
		private tokenService: TokenService,
		private apollo: Apollo,
		private router: Router
	) {}

	async signInWithGoogle() {
		const googleUser = await this.socialAuthService.signIn(
			GoogleLoginProvider.PROVIDER_ID
		);

		const url = environment.apiUrl + `/auth/google/signin`;

		return this.http
			.post<SignInInfo>(url, { token: googleUser.idToken }, httpOptions)
			.pipe(take(1))
			.subscribe((data) => {
				this.tokenService.saveToken(data.token);
				this._signedIn.next(true);
			});
	}

	async signOut(): Promise<void> {
		await this.apollo.client.resetStore();
		this.tokenService.clearToken();
		this._signedIn.next(false);
		this.router.navigate(['/login']);
	}

	checkSignInStatus() {
		var token = this.tokenService.getToken();
		if (token) {
			this._signedIn.next(true);
			return true;
		}

		this._signedIn.next(false);
		return false;
	}

	getSignedIn() {
		return this._signedIn.getValue();
	}
}

interface SignInInfo {
	token: string;
}
