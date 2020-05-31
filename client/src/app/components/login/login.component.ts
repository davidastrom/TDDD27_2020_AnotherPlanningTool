import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

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

	constructor(private auth: AuthService) {}

	ngOnInit(): void {}

	googleLogin() {
		return this.auth.googleLogin();
	}
}
