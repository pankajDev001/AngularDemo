import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptedCliniciansComponent } from './accepted-clinicians.component';

describe('AcceptedCliniciansComponent', () => {
  let component: AcceptedCliniciansComponent;
  let fixture: ComponentFixture<AcceptedCliniciansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptedCliniciansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptedCliniciansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
