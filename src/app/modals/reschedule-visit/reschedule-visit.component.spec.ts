import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RescheduleVisitComponent } from './reschedule-visit.component';

describe('RescheduleVisitComponent', () => {
  let component: RescheduleVisitComponent;
  let fixture: ComponentFixture<RescheduleVisitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RescheduleVisitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RescheduleVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
