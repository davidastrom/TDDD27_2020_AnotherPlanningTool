import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskInput, AssignUserInput } from 'src/generated/graphql';

@Component({
	selector: 'app-board-list',
	templateUrl: './board-list.component.html',
	styleUrls: ['./board-list.component.scss'],
})
export class BoardListComponent implements OnInit {
	@Input() list: any;
	@Input() teamMembers: any[];

	@Output() addTaskEvent = new EventEmitter<TaskInput>();
	@Output() assignUserEvent = new EventEmitter<AssignUserInput>();

	newTaskInput: TaskInput = {
		boardId: '',
		listId: '',
		title: '',
	};
	showAddForm = false;

	faPlus = faPlus;

	constructor() {}

	ngOnInit(): void {}

	addTask() {
		this.newTaskInput.listId = this.list._id;
		this.addTaskEvent.emit(this.newTaskInput);
	}

	assignUser(input: AssignUserInput) {
		input.listId = this.list._id;
		this.assignUserEvent.emit(input);
	}

	toggleShowAddForm(show: boolean) {
		this.showAddForm = show;
	}
}
