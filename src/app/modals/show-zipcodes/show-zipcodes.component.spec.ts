import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowZipcodesComponent } from './show-zipcodes.component';

describe('ShowZipcodesComponent', () => {
  let component: ShowZipcodesComponent;
  let fixture: ComponentFixture<ShowZipcodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowZipcodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowZipcodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
