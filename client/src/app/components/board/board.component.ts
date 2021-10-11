import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
	AddListGQL,
	AddTaskGQL,
	AssignUserInput,
	GetBoardGQL,
	GetBoardQuery,
	ListInput,
	namedOperations,
	TaskInput,
} from 'src/generated/graphql';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { map, switchMap, first } from 'rxjs/operators';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {
	AssignUserGQL,
	MoveListGQL,
	MoveTaskGQL,
} from '../../../generated/graphql';
import {
	CdkDragDrop,
	moveItemInArray,
	transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
	selector: 'app-board',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
	boardId: string;
	board$: Observable<GetBoardQuery>;
	lists: any[];
	boardMembers: any[];

	newListInput: ListInput = {
		boardId: '',
		name: '',
	};
	showAddForm = false;

	faPlus = faPlus;

	constructor(
		private route: ActivatedRoute,
		private getBoardGQL: GetBoardGQL,
		private addTaskGQL: AddTaskGQL,
		private addListGQL: AddListGQL,
		private assignUserGQL: AssignUserGQL,
		private moveListGQL: MoveListGQL,
		private moveTaskGQL: MoveTaskGQL
	) {}

	ngOnInit(): void {
		this.board$ = this.route.paramMap.pipe(
			switchMap((params: ParamMap) => {
				this.boardId = params.get('boardId')!;
				return this.getBoardGQL
					.watch({ boardId: params.get('boardId') })
					.valueChanges.pipe(
						map((res) => {
							var memberList = res.data.board.members;
							if (res.data.board.team) {
								memberList = memberList.concat(res.data.board.team.members);
							}
							this.boardMembers = [...new Set(memberList)];
							this.lists = [...res.data.board.lists];
							return res.data;
						})
					);
			})
		);
	}

	toggleShowAddForm(show: boolean) {
		this.showAddForm = show;
	}

	newList() {
		this.newListInput.boardId = this.boardId;
		this.addListGQL
			.mutate(
				{ listInput: this.newListInput },
				{ refetchQueries: [namedOperations.Query.getBoard] }
			)
			.subscribe();
		this.newListInput.name = '';
	}

	moveList(event: CdkDragDrop<any, any, any>) {
		moveItemInArray(this.lists, event.previousIndex, event.currentIndex);
		this.moveListGQL
			.mutate(
				{
					index: event.currentIndex,
					listId: event.item.data._id,
					boardId: this.boardId,
				},
				{
					refetchQueries: [namedOperations.Query.getBoard],
				}
			)
			.subscribe();
	}

	newTask(taskInput: TaskInput) {
		taskInput.boardId = this.boardId;
		this.addTaskGQL
			.mutate(
				{ taskInput: taskInput },
				{ refetchQueries: [namedOperations.Query.getBoard] }
			)
			.subscribe();
		taskInput.listId = '';
		taskInput.title = '';
		taskInput.description = '';
	}

	moveTask(event: CdkDragDrop<any, any, any>) {
		this.moveTaskGQL
			.mutate(
				{
					index: event.currentIndex,
					taskId: event.item.data._id,
					goalListId: event.container.data._id,
					startListId: event.previousContainer.data._id,
					boardId: this.boardId,
				},
				{
					refetchQueries: [namedOperations.Query.getBoard],
				}
			)
			.subscribe();
	}

	assignUser(input: AssignUserInput) {
		input.boardId = this.boardId;
		this.assignUserGQL
			.mutate(
				{ input: input },
				{ refetchQueries: [namedOperations.Query.getBoard] }
			)
			.subscribe();
	}
}
