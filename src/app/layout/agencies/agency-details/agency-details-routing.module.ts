import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgencyDetailsComponent } from './agency-details.component';

const routes: Routes = [
  {
    path: '',
    component: AgencyDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AgencyDetailsRoutingModule { }
