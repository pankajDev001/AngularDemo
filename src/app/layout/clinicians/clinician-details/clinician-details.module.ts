import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';

import { ClinicianDetailsRoutingModule } from './clinician-details-routing.module';
import { ClinicianDetailsComponent } from './clinician-details.component';
import {SharedModule} from '../../../modals/shared.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {RatingModule} from 'ng-starrating';

@NgModule({
  declarations: [ClinicianDetailsComponent],
  imports: [
    CommonModule,
    ClinicianDetailsRoutingModule,
    NgbModule,
    DataTablesModule,
    SharedModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    RatingModule
  ]
})
export class ClinicianDetailsModule { }
