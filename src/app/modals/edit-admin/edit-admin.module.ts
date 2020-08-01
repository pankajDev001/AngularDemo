import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditAdminComponent } from './edit-admin.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskModule } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [EditAdminComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule.forRoot(),
    NgxMaskModule.forRoot(),
    NgSelectModule
  ]
})
export class EditAdminModule { }
