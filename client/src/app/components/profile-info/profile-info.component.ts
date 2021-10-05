import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CurrentUserGQL, User } from 'src/generated/graphql';

@Component({
	selector: 'app-profile-info',
	templateUrl: './profile-info.component.html',
	styleUrls: ['./profile-info.component.scss'],
})
export class ProfileInfoComponent implements OnInit {
	@Input()
	user: any;

	constructor() {}

	ngOnInit(): void {
		
	}
}
