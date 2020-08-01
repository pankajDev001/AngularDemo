import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicianDetailsComponent } from './clinician-details.component';

describe('ClinicianDetailsComponent', () => {
  let component: ClinicianDetailsComponent;
  let fixture: ComponentFixture<ClinicianDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClinicianDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicianDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
