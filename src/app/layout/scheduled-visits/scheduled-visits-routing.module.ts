import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScheduledVisitsComponent } from './scheduled-visits.component';

const routes: Routes = [{
  path: '',
  component: ScheduledVisitsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduledVisitsRoutingModule { }
