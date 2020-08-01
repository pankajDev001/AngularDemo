import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduledVisitsRoutingModule } from './scheduled-visits-routing.module';
import { ScheduledVisitsComponent } from './scheduled-visits.component';
import { DataTablesModule } from 'angular-datatables';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import {SharedModule} from '../../modals/shared.module';

@NgModule({
  imports: [
    NgbModule.forRoot(),
    ScheduledVisitsRoutingModule,
    DataTablesModule,
    MalihuScrollbarModule,
    FormsModule,
    NgSelectModule,
    CommonModule,
    ReactiveFormsModule,
    SharedModule
  ],
  entryComponents: [],
  declarations: [ScheduledVisitsComponent],
})
export class ScheduledVisitsModule { }
