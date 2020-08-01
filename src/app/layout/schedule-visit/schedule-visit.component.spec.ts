import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleVisitComponent } from './schedule-visit.component';

describe('ScheduleVisitComponent', () => {
  let component: ScheduleVisitComponent;
  let fixture: ComponentFixture<ScheduleVisitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleVisitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
