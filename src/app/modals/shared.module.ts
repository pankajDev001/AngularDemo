import { NgModule } from '@angular/core';
import {NgbDateParserFormatter, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EditClinicianComponent } from './edit-clinician/edit-clinician.component';
import { VisitDetailsComponent } from './visit-details/visit-details.component';
import { RatingsReviewComponent } from './ratings-review/ratings-review.component';
import { CreatePatientComponent } from './create-patient/create-patient.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';
import {RatingModule} from 'ng-starrating';
import { WriteReviewComponent } from './write-review/write-review.component';
import {ShowZipcodesComponent} from './show-zipcodes/show-zipcodes.component';
import { VisitCliniciansComponent } from './visit-clinicians/visit-clinicians.component';
import {DataTablesModule} from 'angular-datatables';
import { AcceptedCliniciansComponent } from './accepted-clinicians/accepted-clinicians.component';
import { RescheduleVisitComponent } from './reschedule-visit/reschedule-visit.component';
import {NgbDateCustomParserFormatter} from '../services/date-formatter';
import { CancelVisitComponent } from './cancel-visit/cancel-visit.component';
import { CompletedReviewComponent } from './completed-review/completed-review.component';

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule,
      NgbModule,
      NgSelectModule,
      RatingModule,
      NgxMaskModule.forRoot(),
      DataTablesModule
    ],
    exports: [
      EditClinicianComponent,
      VisitDetailsComponent,
      RatingsReviewComponent,
      CreatePatientComponent,
      WriteReviewComponent,
      ShowZipcodesComponent,
      VisitCliniciansComponent,
      AcceptedCliniciansComponent,
      RescheduleVisitComponent,
      CancelVisitComponent,
      CompletedReviewComponent
    ],
    declarations: [
      EditClinicianComponent,
      VisitDetailsComponent,
      RatingsReviewComponent,
      CreatePatientComponent,
      WriteReviewComponent,
      ShowZipcodesComponent,
      VisitCliniciansComponent,
      AcceptedCliniciansComponent,
      RescheduleVisitComponent,
      CancelVisitComponent,
      CompletedReviewComponent
    ],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }  // <-- add this
  ],
    entryComponents: [
      EditClinicianComponent,
      VisitDetailsComponent,
      RatingsReviewComponent,
      CreatePatientComponent,
      WriteReviewComponent,
      ShowZipcodesComponent,
      VisitCliniciansComponent,
      AcceptedCliniciansComponent,
      RescheduleVisitComponent,
      CancelVisitComponent,
      CompletedReviewComponent
    ]
})
export class SharedModule {}
