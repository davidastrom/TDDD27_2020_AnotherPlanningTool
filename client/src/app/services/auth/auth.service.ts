import { Injectable } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	constructor(private socialAuthService: SocialAuthService) {}

	signInWithGoogle(): void {
		this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(
			(user) => {
				console.log('User:', user);
			},
			(e) => {
				console.log('Unsuccessful:', e);
			}
		);
	}
}
