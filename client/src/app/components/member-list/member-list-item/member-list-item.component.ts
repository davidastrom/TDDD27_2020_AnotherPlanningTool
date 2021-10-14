import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faUserMinus } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-member-list-item',
	templateUrl: './member-list-item.component.html',
	styleUrls: ['./member-list-item.component.scss'],
})
export class MemberListItemComponent implements OnInit {
	@Input() item: MemberListItem;

	@Output() remove = new EventEmitter<string>();

	faUserMinus = faUserMinus;

	constructor() {}

	ngOnInit(): void {}

	removeMember() {
		this.remove.emit(this.item._id);
	}
}

export class MemberListItem {
	_id: string;
	username: string;
	picture?: string | null | undefined;
}
