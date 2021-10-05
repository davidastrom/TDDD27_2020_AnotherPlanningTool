import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, CurrentUserGQL } from 'src/generated/graphql';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  user$ = this.currentUserGQL.fetch().pipe(map((res) => res.data.currentUser))

  constructor(private currentUserGQL: CurrentUserGQL) { }

  ngOnInit(): void {
  }

}
