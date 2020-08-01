import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CliniciansComponent } from './clinicians.component';

const routes: Routes = [
  {
    path:'',
    component: CliniciansComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CliniciansRoutingModule { }
