import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledVisitsComponent } from './scheduled-visits.component';

describe('ScheduledVisitsComponent', () => {
  let component: ScheduledVisitsComponent;
  let fixture: ComponentFixture<ScheduledVisitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledVisitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
