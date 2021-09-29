import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserProfile } from 'src/app/models/user.model';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private _user = new BehaviorSubject<UserProfile | null>(null);

	readonly user$ = this._user.asObservable();

	constructor() {}

	public getUser() {
		return this._user.getValue();
	}

	public setUser(user: UserProfile) {
		this._user.next(user);
		console.log('User set');
	}

	public clearUser() {
		this._user.next(null);
	}
}
