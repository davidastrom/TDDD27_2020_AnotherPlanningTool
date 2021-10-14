import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-home-list-item',
	templateUrl: './home-list-item.component.html',
	styleUrls: ['./home-list-item.component.scss'],
})
export class HomeListItemComponent implements OnInit {
	@Input() item: HomeListItem;
	@Input() url = '';
	@Input() showMemberCount: boolean;

	constructor() {}

	ngOnInit(): void {}
}

export class HomeListItem {
	_id: string;
	name: string;
	members: Array<{ __typename?: 'User'; _id: string }>;
}
