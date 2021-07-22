import { Component, OnInit } from '@angular/core';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { GoogleLoginProvider, SocialAuthService } from "angularx-social-login";

@Component({
	selector: 'app-login',
	host: {
		class: 'page-container',
	},
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	faGoogle = faGoogle;

	constructor(private authService: SocialAuthService) {}

	ngOnInit(): void {}

	googleLogin() {
		this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
	}
}
