import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PatientReviewComponent} from './patient-review.component';

const routes: Routes = [
    {
        path: '', component: PatientReviewComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PatientReviewRoutingModule {
}
