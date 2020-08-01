import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleVisitRoutingModule } from './schedule-visit-routing.module';
import { ScheduleVisitComponent } from './schedule-visit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';
import {NgbDateParserFormatter, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NgbDateCustomParserFormatter} from '../../services/date-formatter';
import {DataTablesModule} from 'angular-datatables';
import {AgmCoreModule} from '@agm/core';
import {environment} from '../../../environments/environment';
import {SharedModule} from '../../modals/shared.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {RatingModule} from 'ng-starrating';
import {CalendarModule} from 'primeng/calendar';


@NgModule({
  declarations: [ScheduleVisitComponent],
  imports: [
    CommonModule,
    SharedModule,
    ScheduleVisitRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxMaskModule,
    DataTablesModule,
    AgmCoreModule.forRoot({
      apiKey: environment.apiKey,
      libraries: ['places']
    }),
    NgxPaginationModule,
    RatingModule,
    CalendarModule
  ],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }  // <-- add this
  ]
})
export class ScheduleVisitModule { }
