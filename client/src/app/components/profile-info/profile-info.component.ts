import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CurrentUserGQL, User } from 'src/generated/graphql';

@Component({
	selector: 'app-profile-info',
	templateUrl: './profile-info.component.html',
	styleUrls: ['./profile-info.component.scss'],
})
export class ProfileInfoComponent implements OnInit {
	user$: Observable<User> = new Observable<User>();

	constructor(private currentUserGQL: CurrentUserGQL) {}

	ngOnInit(): void {
		this.user$ = this.currentUserGQL.fetch().pipe(map((res) => {
			console.log(res);
			let data = res.data.currentUser;
			return {...data, boards: [], teams: []}
		}));
	}
}
