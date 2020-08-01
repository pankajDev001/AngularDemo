import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScheduleVisitComponent } from './schedule-visit.component';

const routes: Routes = [{
  path: '',
  component: ScheduleVisitComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleVisitRoutingModule { }
