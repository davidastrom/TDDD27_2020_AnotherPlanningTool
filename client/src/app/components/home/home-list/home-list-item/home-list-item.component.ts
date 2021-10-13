import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-list-item',
  templateUrl: './home-list-item.component.html',
  styleUrls: ['./home-list-item.component.scss']
})
export class HomeListItemComponent implements OnInit {
  @Input() item: any;
  @Input() url = '';
  @Input() showMemberCount: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
