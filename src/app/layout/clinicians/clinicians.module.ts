import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CliniciansRoutingModule } from './clinicians-routing.module';
import { CliniciansComponent } from './clinicians.component';

import { RatingsReviewComponent } from '../../modals/ratings-review/ratings-review.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {SharedModule} from '../../modals/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {RatingModule} from 'ng-starrating';


@NgModule({
  declarations: [CliniciansComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    CliniciansRoutingModule,
    NgxPaginationModule,
    NgSelectModule,
    SharedModule,
    RatingModule
  ],
  entryComponents: [RatingsReviewComponent]
})
export class CliniciansModule { }
