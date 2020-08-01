import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageModulesComponent } from './manage-modules.component';

describe('ManageModulesComponent', () => {
  let component: ManageModulesComponent;
  let fixture: ComponentFixture<ManageModulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageModulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
