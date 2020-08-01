import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgencyDashboardComponent } from './agency-dashboard.component';

const routes: Routes = [{
  path: '',
  component: AgencyDashboardComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgencyDashboardRoutingModule { }
