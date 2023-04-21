import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsePerDialogComponent } from './use-per-dialog.component';

describe('UsePerDialogComponent', () => {
  let component: UsePerDialogComponent;
  let fixture: ComponentFixture<UsePerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsePerDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsePerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
