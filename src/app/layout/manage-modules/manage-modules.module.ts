import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageModulesRoutingModule } from './manage-modules-routing.module';
import { ManageModulesComponent } from './manage-modules.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MalihuScrollbarModule } from 'ngx-malihu-scrollbar';
import { DataTablesModule } from 'angular-datatables';
import {FormsModule} from '@angular/forms';
import {SharedPipesModule} from '../../shared';

@NgModule({
  declarations: [ManageModulesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ManageModulesRoutingModule,
    NgbModule.forRoot(),
    MalihuScrollbarModule,
    DataTablesModule,
    SharedPipesModule
  ]
})
export class ManageModulesModule { }
