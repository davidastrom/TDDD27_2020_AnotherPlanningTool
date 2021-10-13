import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faUserMinus } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-member-list-item',
  templateUrl: './member-list-item.component.html',
  styleUrls: ['./member-list-item.component.scss']
})
export class MemberListItemComponent implements OnInit {
  @Input() item: any;

  @Output() remove = new EventEmitter<string>();

  faUserMinus = faUserMinus

  constructor() { }

  ngOnInit(): void {
  }

  removeMember() {
    this.remove.emit(this.item._id)
  }
}
