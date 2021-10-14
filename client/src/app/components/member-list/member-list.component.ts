import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import {
	debounceTime,
	distinctUntilChanged,
	map,
	switchMap,
} from 'rxjs/operators';
import { GetAllUsersGQL, GetAllUsersQuery } from 'src/generated/graphql';
import { MemberListItem } from './member-list-item/member-list-item.component';

@Component({
	selector: 'app-member-list',
	templateUrl: './member-list.component.html',
	styleUrls: ['./member-list.component.scss'],
})
export class MemberListComponent implements OnInit {
	@Input() list: MemberListItem[] = [];

	@Output() newMemberEvent = new EventEmitter<string>();
	@Output() removeMemberEvent = new EventEmitter<string>();

	showAddForm = false;
	newMember: { __typename?: 'User'; _id: string; username: string };
	searchUsers$: Observable<GetAllUsersQuery>;

	faPlus = faPlus;

	constructor(private getAllUsersGql: GetAllUsersGQL) {}

	ngOnInit(): void {
		this.searchUsers$ = this.getAllUsersGql
			.watch()
			.valueChanges.pipe(map((res) => res.data));
	}

	addMember(): void {
		if (this.newMember) {
			this.newMemberEvent.emit(this.newMember._id);
			this.toggleShowAddForm(false);
		}
	}

	removeMember(id: string): void {
		this.removeMemberEvent.emit(id);
	}

	toggleShowAddForm(show: boolean) {
		this.showAddForm = show;
	}

	formatter = (member: {
		__typename?: 'User';
		_id: string;
		username: string;
	}) => member.username;

	search = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(200),
			distinctUntilChanged(),
			switchMap((term) =>
				this.searchUsers$
					.pipe(map((users) => users.allUsers))
					.pipe(
						map((users) =>
							users
								.filter((user) => new RegExp(term, 'i').test(user.username))
								.slice(0, 10)
						)
					)
					.pipe()
			)
		);
}
