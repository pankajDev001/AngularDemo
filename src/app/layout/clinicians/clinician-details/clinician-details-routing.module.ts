import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClinicianDetailsComponent } from './clinician-details.component';

const routes: Routes = [
  {
    path: '',
    component: ClinicianDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClinicianDetailsRoutingModule { }
