import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateAdminComponent } from './create-admin.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [CreateAdminComponent],
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    NgxMaskModule.forRoot(),
    NgSelectModule
  ],
  exports: [CreateAdminComponent]
})
export class CreateAdminModule { }
