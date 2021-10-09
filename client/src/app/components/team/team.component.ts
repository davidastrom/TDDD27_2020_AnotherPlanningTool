import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
	AddTeamMemberGQL,
	CreateBoardGQL,
	GetTeamGQL,
	GetTeamQuery,
	namedOperations,
	RemoveTeamMemberGQL,
} from 'src/generated/graphql';

@Component({
	selector: 'app-team',
	templateUrl: './team.component.html',
	styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit {
	teamId: string;
	team$: Observable<GetTeamQuery>;

	constructor(
		private route: ActivatedRoute,
		private getTeamGQL: GetTeamGQL,
		private createBoardGQL: CreateBoardGQL,
		private addTeamMemberGQL: AddTeamMemberGQL,
		private removeTeamMemberGQL: RemoveTeamMemberGQL
	) {}

	ngOnInit(): void {
		this.team$ = this.route.paramMap.pipe(
			switchMap((params: ParamMap) => {
				this.teamId = params.get('teamId')!;
				return this.getTeamGQL
					.watch({ id: params.get('teamId') })
					.valueChanges.pipe(map((res) => res.data));
			})
		);
	}

	addBoard(name: string) {
		this.createBoardGQL
			.mutate(
				{ input: { name: name }, teamId: this.teamId },
				{ refetchQueries: [namedOperations.Query.getTeam] }
			)
			.subscribe();
	}

	addMember(id: string) {
		this.addTeamMemberGQL
			.mutate(
				{ userId: id, teamId: this.teamId },
				{ refetchQueries: [namedOperations.Query.getTeam] }
			)
			.subscribe();
	}

	removeMember(id: string) {
		this.removeTeamMemberGQL
			.mutate(
				{ userId: id, teamId: this.teamId },
				{ refetchQueries: [namedOperations.Query.getTeam] }
			)
			.subscribe();
	}
}
