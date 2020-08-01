import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitCliniciansComponent } from './visit-clinicians.component';

describe('VisitCliniciansComponent', () => {
  let component: VisitCliniciansComponent;
  let fixture: ComponentFixture<VisitCliniciansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitCliniciansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitCliniciansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
