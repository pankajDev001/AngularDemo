import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';

import { AgencyDetailsRoutingModule } from './agency-details-routing.module';
import { AgencyDetailsComponent } from './agency-details.component';
import { RatingModule } from 'ng-starrating';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditAgencyComponent } from '../../../modals/edit-agency/edit-agency.component';
import { EditAgencyModule } from '../../../modals/edit-agency/edit-agency.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {NgSelectModule} from '@ng-select/ng-select';
import {SharedModule} from '../../../modals/shared.module';

@NgModule({
  declarations: [AgencyDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    SharedModule,
    AgencyDetailsRoutingModule,
    DataTablesModule,
    RatingModule,
    EditAgencyModule,
    NgbModule.forRoot(),
    ReactiveFormsModule,
  ],
  entryComponents: [EditAgencyComponent]
})
export class AgencyDetailsModule { }
