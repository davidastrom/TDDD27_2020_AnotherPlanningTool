import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import {
	AddBoardMemberGQL,
	AddListGQL,
	AddTaskGQL,
	AssignUserInput,
	GetBoardGQL,
	GetBoardQuery,
	ListInput,
	ListUpdateGQL,
	namedOperations,
	RemoveBoardMemberGQL,
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

	listUpdateSubscription: Subscription;

	newListInput: ListInput = {
		boardId: '',
		name: '',
	};
	showAddForm = false;

	faPlus = faPlus;

	constructor(
		private route: ActivatedRoute,
		private getBoardGQL: GetBoardGQL,
		private listUpdateGQL: ListUpdateGQL,
		private addTaskGQL: AddTaskGQL,
		private addListGQL: AddListGQL,
		private assignUserGQL: AssignUserGQL,
		private moveListGQL: MoveListGQL,
		private moveTaskGQL: MoveTaskGQL,
		private addBoardMemberGQL: AddBoardMemberGQL,
		private removeBoardMemberGQL: RemoveBoardMemberGQL
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
		this.listUpdateSubscription = this.route.paramMap
			.pipe(
				switchMap((params: ParamMap) => {
					return this.listUpdateGQL.subscribe({
						boardId: params.get('boardId')!,
					});
				})
			)
			.subscribe(({ data }) => {
				console.log(data);
				if (data) {
					this.lists = data.boardListsSubscription;
				}
			});
	}

	ngOnDestroy(): void {
		this.listUpdateSubscription.unsubscribe();
	}

	toggleShowAddForm(show: boolean) {
		this.showAddForm = show;
	}

	newList() {
		this.newListInput.boardId = this.boardId;
		this.addListGQL.mutate({ listInput: this.newListInput }).subscribe();
		this.newListInput.name = '';
	}

	moveList(event: CdkDragDrop<any, any, any>) {
		moveItemInArray(this.lists, event.previousIndex, event.currentIndex);
		this.moveListGQL
			.mutate({
				index: event.currentIndex,
				listId: event.item.data._id,
				boardId: this.boardId,
			})
			.subscribe();
	}

	newTask(taskInput: TaskInput) {
		taskInput.boardId = this.boardId;
		this.addTaskGQL.mutate({ taskInput: taskInput }).subscribe();
		taskInput.listId = '';
		taskInput.title = '';
		taskInput.description = '';
	}

	moveTask(event: CdkDragDrop<any, any, any>) {
		this.moveTaskGQL
			.mutate({
				index: event.currentIndex,
				taskId: event.item.data._id,
				goalListId: event.container.data._id,
				startListId: event.previousContainer.data._id,
				boardId: this.boardId,
			})
			.subscribe();
	}

	assignUser(input: AssignUserInput) {
		input.boardId = this.boardId;
		this.assignUserGQL.mutate({ input: input }).subscribe();
	}

	addMember(id: string) {
		this.addBoardMemberGQL
			.mutate(
				{ userId: id, boardId: this.boardId },
				{ refetchQueries: [namedOperations.Query.getBoard] }
			)
			.subscribe();
	}
	removeMember(id: string) {
		this.removeBoardMemberGQL
			.mutate(
				{ userId: id, boardId: this.boardId },
				{ refetchQueries: [namedOperations.Query.getBoard] }
			)
			.subscribe();
	}
}
