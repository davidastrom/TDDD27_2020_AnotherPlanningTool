import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-list',
  templateUrl: './home-list.component.html',
  styleUrls: ['./home-list.component.scss']
})
export class HomeListComponent implements OnInit {
  @Input() title = ''
  @Input() list!: any[]

  constructor() { }

  ngOnInit(): void {
  }

}
