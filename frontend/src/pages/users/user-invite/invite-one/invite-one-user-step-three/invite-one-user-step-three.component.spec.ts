import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteOneUserStepThreeComponent } from './invite-one-user-step-three.component';

describe('InviteOneUserStepThreeComponent', () => {
  let component: InviteOneUserStepThreeComponent;
  let fixture: ComponentFixture<InviteOneUserStepThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteOneUserStepThreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteOneUserStepThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
