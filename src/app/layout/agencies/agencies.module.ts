import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgenciesRoutingModule } from './agencies-routing.module';
import { AgenciesComponent } from './agencies.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { RatingModule } from 'ng-starrating';
import { EditAgencyComponent } from '../../modals/edit-agency/edit-agency.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditAgencyModule } from '../../modals/edit-agency/edit-agency.module';
import {SharedModule} from '../../modals/shared.module';
import {RatingsReviewComponent} from '../../modals/ratings-review/ratings-review.component';

@NgModule({
  declarations: [AgenciesComponent],
  imports: [
    CommonModule,
    AgenciesRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    NgSelectModule,
    SharedModule,
    RatingModule,
    EditAgencyModule,
    NgbModule.forRoot(),
  ],
  entryComponents: [EditAgencyComponent, RatingsReviewComponent]
})
export class AgenciesModule { }
