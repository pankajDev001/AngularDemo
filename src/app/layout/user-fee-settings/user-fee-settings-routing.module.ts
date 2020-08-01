import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserFeeSettingsComponent } from './user-fee-settings.component';

const routes: Routes = [
  {
    path: '',
    component: UserFeeSettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserFeeSettingsRoutingModule { }
