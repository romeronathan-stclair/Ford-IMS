import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteOneUserStepOneComponent } from './invite-one-user-step-one.component';

describe('InviteOneUserStepOneComponent', () => {
  let component: InviteOneUserStepOneComponent;
  let fixture: ComponentFixture<InviteOneUserStepOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteOneUserStepOneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteOneUserStepOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
