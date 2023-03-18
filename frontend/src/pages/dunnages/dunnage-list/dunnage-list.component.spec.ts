import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DunnageListComponent } from './dunnage-list.component';

describe('DunnageListComponent', () => {
  let component: DunnageListComponent;
  let fixture: ComponentFixture<DunnageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DunnageListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DunnageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
