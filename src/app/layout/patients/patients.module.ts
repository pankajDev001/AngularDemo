import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PatientsRoutingModule } from './patients-routing.module';
import { PatientsComponent } from './patients.component';
import { DataTablesModule } from 'angular-datatables';
import { PatientDetailsModule } from '../../modals/patient-details/patient-details.module';
import { PatientDetailsComponent } from '../../modals/patient-details/patient-details.component';
import { CreatePatientComponent } from '../../modals/create-patient/create-patient.component';
import { SharedModule } from '../../modals/shared.module';

@NgModule({
  declarations: [PatientsComponent],
  imports: [
    NgbModule.forRoot(),
    CommonModule,
    PatientsRoutingModule,
    DataTablesModule,
    PatientDetailsModule,
    SharedModule
  ],
  entryComponents: [PatientDetailsComponent, CreatePatientComponent]
})
export class PatientsModule { }
