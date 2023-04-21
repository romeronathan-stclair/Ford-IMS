import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteMultipleUsersComponent } from './invite-multiple-users.component';

describe('InviteMultipleUsersComponent', () => {
  let component: InviteMultipleUsersComponent;
  let fixture: ComponentFixture<InviteMultipleUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteMultipleUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteMultipleUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
