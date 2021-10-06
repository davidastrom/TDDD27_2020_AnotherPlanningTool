import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CurrentUserQuery, CurrentUserGQL, CreateBoardGQL, CreateTeamGQL } from 'src/generated/graphql';
import { namedOperations } from '../../../generated/graphql';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  user$: Observable<CurrentUserQuery>;

  constructor(private currentUserGQL: CurrentUserGQL, private createBoardGQL: CreateBoardGQL, private createTeamGQL: CreateTeamGQL) { }

  ngOnInit(): void {
    this.user$ = this.currentUserGQL.watch().valueChanges.pipe(map((res) => res.data))
  }

  addBoard(name: string) {
    this.createBoardGQL.mutate({input: {name: name}}, {refetchQueries: [namedOperations.Query.currentUser]}).subscribe();
  }

  addTeam(name: string) {
    this.createTeamGQL.mutate({input: {name: name}}, {refetchQueries: [namedOperations.Query.currentUser]}).subscribe();
  }
}
