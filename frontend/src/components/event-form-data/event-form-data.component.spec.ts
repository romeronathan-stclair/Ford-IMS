import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventFormDataComponent } from './event-form-data.component';

describe('EventFormDataComponent', () => {
  let component: EventFormDataComponent;
  let fixture: ComponentFixture<EventFormDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventFormDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventFormDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
