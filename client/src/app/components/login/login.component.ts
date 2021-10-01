import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { first } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TokenService } from 'src/app/services/token/token.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	faGoogle = faGoogle;

	constructor(
		private authService: AuthService,
		private userService: UserService,
		private router: Router
	) {}

	ngOnInit(): void {}

	async signInWithGoogle() {
		await this.authService.signInWithGoogle();
		this.authService.signedIn$.subscribe((loggedIn) => {
			if (loggedIn) {
				this.router.navigate([this.authService.redirectUrl]);
			}
		});
	}
}
