import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleCheckComponent } from './cycle-check.component';

describe('CycleCheckComponent', () => {
  let component: CycleCheckComponent;
  let fixture: ComponentFixture<CycleCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CycleCheckComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CycleCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
