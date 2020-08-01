import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgencyDashboardRoutingModule } from './agency-dashboard-routing.module';
import { AgencyDashboardComponent } from './agency-dashboard.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [AgencyDashboardComponent],
  imports: [
    CommonModule,
    AgencyDashboardRoutingModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule
  ]
})
export class AgencyDashboardModule { }
