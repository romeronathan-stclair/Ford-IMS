import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleCheckListComponent } from './cycle-check-list.component';

describe('CycleCheckListComponent', () => {
  let component: CycleCheckListComponent;
  let fixture: ComponentFixture<CycleCheckListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CycleCheckListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CycleCheckListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
