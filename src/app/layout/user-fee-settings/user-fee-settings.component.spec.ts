import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFeeSettingsComponent } from './user-fee-settings.component';

describe('UserFeeSettingsComponent', () => {
  let component: UserFeeSettingsComponent;
  let fixture: ComponentFixture<UserFeeSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFeeSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFeeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
