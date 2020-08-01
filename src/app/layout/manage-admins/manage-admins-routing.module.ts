import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageAdminsComponent } from './manage-admins.component';

const routes: Routes = [
  {
    path: '', 
    component: ManageAdminsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageAdminsRoutingModule { }
