import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientReviewComponent } from './patient-review.component';

describe('PatientReviewComponent', () => {
  let component: PatientReviewComponent;
  let fixture: ComponentFixture<PatientReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
