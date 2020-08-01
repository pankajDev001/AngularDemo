import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditClinicianComponent } from './edit-clinician.component';

describe('EditClinicianComponent', () => {
  let component: EditClinicianComponent;
  let fixture: ComponentFixture<EditClinicianComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditClinicianComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditClinicianComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
