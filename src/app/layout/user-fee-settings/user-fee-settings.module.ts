import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserFeeSettingsRoutingModule } from './user-fee-settings-routing.module';
import { UserFeeSettingsComponent } from './user-fee-settings.component';
import { DataTablesModule } from 'angular-datatables';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxMaskModule} from 'ngx-mask';

@NgModule({
  declarations: [UserFeeSettingsComponent],
  imports: [
    CommonModule,
    UserFeeSettingsRoutingModule,
    DataTablesModule,
    MalihuScrollbarModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot()
  ],
})
export class UserFeeSettingsModule { }
