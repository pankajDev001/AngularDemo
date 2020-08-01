import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ManageAdminsRoutingModule } from './manage-admins-routing.module';
import { ManageAdminsComponent } from './manage-admins.component';
import { CreateAdminModule } from '../../modals/create-admin/create-admin.module';
import { CreateAdminComponent } from '../../modals/create-admin/create-admin.component';
import { EditAdminModule } from '../../modals/edit-admin/edit-admin.module';
import { EditAdminComponent } from '../../modals/edit-admin/edit-admin.component';
import { DataTablesModule } from 'angular-datatables';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  declarations: [ManageAdminsComponent],
  imports: [
    CommonModule,
    ManageAdminsRoutingModule,
    NgbModule.forRoot(),
    CreateAdminModule,
    EditAdminModule,
    DataTablesModule,
    SweetAlert2Module.forRoot()
  ],
  entryComponents: [CreateAdminComponent, EditAdminComponent]
})
export class ManageAdminsModule { }
