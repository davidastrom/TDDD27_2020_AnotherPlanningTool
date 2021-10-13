import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent {
	title = 'client';

	constructor(private authService: AuthService) {}

	signedIn() {
		return this.authService.getSignedIn();
	}

	async signOut() {
		await this.authService.signOut();
	}
}
