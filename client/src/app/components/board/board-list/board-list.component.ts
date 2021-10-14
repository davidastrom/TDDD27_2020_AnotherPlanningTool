import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { TaskInput, AssignUserInput } from 'src/generated/graphql';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { BoardListTask } from './board-list-task/board-list-task.component';

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
	@Output() moveTaskEvent = new EventEmitter<CdkDragDrop<any, any, any>>();

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

	moveTask(event: CdkDragDrop<any, any, any>) {
		this.moveTaskEvent.emit(event);
	}

	assignUser(input: AssignUserInput) {
		input.listId = this.list._id;
		this.assignUserEvent.emit(input);
	}

	toggleShowAddForm(show: boolean) {
		this.showAddForm = show;
	}
}

export class BoardList {
	_id: string;
	name: string;
	items: BoardListTask[];
}
