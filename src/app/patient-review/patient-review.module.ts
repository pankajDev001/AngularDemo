import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientReviewComponent } from './patient-review.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {NgxMaskModule} from 'ngx-mask';
import {PatientReviewRoutingModule} from './patient-review-routing.module';
import {RatingModule} from 'ng-starrating';

@NgModule({
  declarations: [PatientReviewComponent],
  imports: [
    CommonModule,
    TranslateModule,
    PatientReviewRoutingModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    RatingModule
  ]
})
export class PatientReviewModule { }
