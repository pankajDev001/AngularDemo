import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelVisitComponent } from './cancel-visit.component';

describe('CancelVisitComponent', () => {
  let component: CancelVisitComponent;
  let fixture: ComponentFixture<CancelVisitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CancelVisitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
