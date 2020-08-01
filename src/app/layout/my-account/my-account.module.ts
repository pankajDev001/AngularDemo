import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyAccountRoutingModule } from './my-account-routing.module';
import { MyAccountComponent } from './my-account.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {NgbDateParserFormatter, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperModule } from 'ngx-image-cropper';
import { UpdateProfileImageModule } from 'src/app/modals/update-profile-image/update-profile-image.module';
import { UpdateProfileImageComponent } from 'src/app/modals/update-profile-image/update-profile-image.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxMaskModule} from 'ngx-mask';
import {NgbDateCustomParserFormatter} from '../../services/date-formatter';

@NgModule({
  declarations: [MyAccountComponent],
  imports: [
    CommonModule,
    MyAccountRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule.forRoot(),
    ImageCropperModule,
    UpdateProfileImageModule,
    NgSelectModule,
    NgxMaskModule.forRoot()
  ],
  entryComponents: [UpdateProfileImageComponent],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }  // <-- add this
],
})
export class MyAccountModule { }
