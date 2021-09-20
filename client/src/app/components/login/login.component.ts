import { Component, OnInit } from '@angular/core';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	faGoogle = faGoogle;

	constructor(private authService: AuthService) {}

	ngOnInit(): void {}

	signInWithGoogle() {
		this.authService.signInWithGoogle();
	}
}
