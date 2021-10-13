import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardListTaskComponent } from './board-list-task.component';

describe('BoardListTaskComponent', () => {
  let component: BoardListTaskComponent;
  let fixture: ComponentFixture<BoardListTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardListTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardListTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
