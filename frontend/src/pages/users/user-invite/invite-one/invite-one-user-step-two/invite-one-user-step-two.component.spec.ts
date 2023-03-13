import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteOneUserStepTwoComponent } from './invite-one-user-step-two.component';

describe('InviteOneUserStepTwoComponent', () => {
  let component: InviteOneUserStepTwoComponent;
  let fixture: ComponentFixture<InviteOneUserStepTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteOneUserStepTwoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteOneUserStepTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
