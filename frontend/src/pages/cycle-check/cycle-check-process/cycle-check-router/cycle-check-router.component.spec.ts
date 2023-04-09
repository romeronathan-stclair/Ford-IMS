import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleCheckRouterComponent } from './cycle-check-router.component';

describe('CycleCheckRouterComponent', () => {
  let component: CycleCheckRouterComponent;
  let fixture: ComponentFixture<CycleCheckRouterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CycleCheckRouterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CycleCheckRouterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
