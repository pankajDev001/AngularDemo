import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentReportRoutingModule } from './payment-report-routing.module';
import { PaymentReportComponent } from './payment-report.component';
import { DataTablesModule } from 'angular-datatables';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [PaymentReportComponent],
  imports: [
    CommonModule,
    PaymentReportRoutingModule,
    DataTablesModule,
    MalihuScrollbarModule.forRoot(),
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule.forRoot()
  ]
})
export class PaymentReportModule { }
