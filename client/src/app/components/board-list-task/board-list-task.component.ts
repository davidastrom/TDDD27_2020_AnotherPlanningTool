import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { AssignUserInput } from 'src/generated/graphql';

@Component({
	selector: 'app-board-list-task',
	templateUrl: './board-list-task.component.html',
	styleUrls: ['./board-list-task.component.scss'],
})
export class BoardListTaskComponent implements OnInit {
	@Input() task: any;
	@Input() teamMembers: any[];

	@Output() assignUserEvent = new EventEmitter<AssignUserInput>();

	showDetails: boolean = false;

	assignedUser: any;

	constructor() {}

	ngOnInit(): void {
		if (this.task.assigned) {
			this.assignedUser = this.teamMembers.find(
				(member) => member._id == this.task.assigned._id
			);
		}
	}

	toggleShowDetails(show: boolean) {
		this.showDetails = show;
	}

	isAssigned(id: string) {
		return this.task.assigned?._id == id;
	}

	assignUser() {
		var input: AssignUserInput = {
			boardId: '',
			listId: '',
			taskId: this.task._id,
			userId: this.assignedUser._id,
		};
		this.assignUserEvent.emit(input);
	}
}
