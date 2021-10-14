import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-profile-info',
	templateUrl: './profile-info.component.html',
	styleUrls: ['./profile-info.component.scss'],
})
export class ProfileInfoComponent implements OnInit {
	@Input() user: ProfileInfoUser | undefined;

	constructor() {}

	ngOnInit(): void {}
}

export class ProfileInfoUser {
	_id: string;
	email: string;
	username: string;
	picture?: string | null | undefined;
}
