import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerifyOtpComponent } from './verify-otp.component';

const routes: Routes = [
  {
    path: '',
    component: VerifyOtpComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerifyOtpRoutingModule { }
