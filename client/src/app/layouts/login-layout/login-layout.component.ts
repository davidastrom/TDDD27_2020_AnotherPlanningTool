import { Component, OnInit } from '@angular/core';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';

@Component({
	selector: 'app-login-layout',
	templateUrl: './login-layout.component.html',
	styleUrls: ['./login-layout.component.scss'],
})
export class LoginLayoutComponent implements OnInit {
	faGoogle = faGoogle;

	constructor() {}

	ngOnInit(): void {}
}
