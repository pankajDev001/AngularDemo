import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyOtpRoutingModule } from './verify-otp-routing.module';
import { VerifyOtpComponent } from './verify-otp.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';

@NgModule({
  declarations: [VerifyOtpComponent],
  imports: [
    CommonModule,
    VerifyOtpRoutingModule,
    ReactiveFormsModule,
    NgxMaskModule.forChild()
  ]
})
export class VerifyOtpModule { }
