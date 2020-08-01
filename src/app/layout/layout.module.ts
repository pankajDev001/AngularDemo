import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { DataTablesModule } from 'angular-datatables';
import {SharedModule} from "../modals/shared.module";


@NgModule({
    imports: [
      CommonModule,
      LayoutRoutingModule,
      TranslateModule,
      NgbModule.forRoot(),
      DataTablesModule.forRoot(),
      SharedModule
    ],
    declarations: [LayoutComponent, SidebarComponent, HeaderComponent],
    providers: [DatePipe]
})
export class LayoutModule {}
