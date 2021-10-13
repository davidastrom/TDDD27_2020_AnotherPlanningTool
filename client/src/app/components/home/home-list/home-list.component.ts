import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home-list',
  templateUrl: './home-list.component.html',
  styleUrls: ['./home-list.component.scss']
})
export class HomeListComponent implements OnInit {
  @Input() title = ''
  @Input() list: any[] = []
  @Input() showMemberCount: boolean;
  
  @Output() newItemEvent = new EventEmitter<string>();

  showAddForm = false;
  newItemName = '';

  faPlus = faPlus

  constructor() { }

  ngOnInit(): void {
  }

  addItem(): void {
    this.newItemEvent.emit(this.newItemName);
    this.toggleShowAddForm(false);
  }

  toggleShowAddForm(show: boolean) {
    this.showAddForm = show
  }

  getUrl(id: string) {
    return `/${this.title.toLowerCase()}/${id}`
  }
}
