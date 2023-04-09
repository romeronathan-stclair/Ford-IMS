import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteOneUserComponent } from './invite-one-user.component';

describe('InviteOneUserComponent', () => {
  let component: InviteOneUserComponent;
  let fixture: ComponentFixture<InviteOneUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteOneUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteOneUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
