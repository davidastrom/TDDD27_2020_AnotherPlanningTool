import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/generated/graphql';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private _user = new BehaviorSubject<User | null>(null);

	readonly user$ = this._user.asObservable();

	constructor() {}

	public getUser() {
		return this._user.getValue();
	}

	public setUser(user: User) {
		this._user.next(user);
	}

	public fetchUser() {}

	public clearUser() {
		this._user.next(null);
	}
}
