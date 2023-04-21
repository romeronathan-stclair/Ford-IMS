import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassignDunnageComponent } from './reassign-dunnage.component';

describe('ReassignDunnageComponent', () => {
  let component: ReassignDunnageComponent;
  let fixture: ComponentFixture<ReassignDunnageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReassignDunnageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReassignDunnageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
