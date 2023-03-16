import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDunnageComponent } from './view-dunnage.component';

describe('ViewDunnageComponent', () => {
  let component: ViewDunnageComponent;
  let fixture: ComponentFixture<ViewDunnageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDunnageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDunnageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
