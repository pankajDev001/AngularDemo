import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateProfileImageComponent } from './update-profile-image.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [UpdateProfileImageComponent],
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    ImageCropperModule
  ]
})
export class UpdateProfileImageModule { }
