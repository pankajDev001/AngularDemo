import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DataTablesModule } from 'angular-datatables';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    DataTablesModule.forRoot(),
    MalihuScrollbarModule.forRoot(),
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule.forRoot()
  ],
})
export class DashboardModule { }
