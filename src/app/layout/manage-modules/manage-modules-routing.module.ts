import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageModulesComponent } from './manage-modules.component';

const routes: Routes = [{
  path: '',
  component: ManageModulesComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageModulesRoutingModule { }
