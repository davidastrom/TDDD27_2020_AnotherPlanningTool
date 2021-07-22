import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProfileListComponent } from './profile-list.component';

describe('ProfileListComponent', () => {
	let component: ProfileListComponent;
	let fixture: ComponentFixture<ProfileListComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ProfileListComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ProfileListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
