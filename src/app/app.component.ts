import { Component, OnInit } from '@angular/core';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';
import * as signalR from "@aspnet/signalr";
import { HubConnection } from '@aspnet/signalr';
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private hubConnection: HubConnection;

  constructor(
      private mScrollbarService: MalihuScrollbarService,
      private toastr: ToastrService,

  ) {}

    ngOnInit() {



    }

    ngAfterViewInit(){
      // this.mScrollbarService.initScrollbar(document.body, { axis: 'y', theme: 'healthPro-scrollbar',mouseWheelPixels: 250 });
    }

    ngOnDestroy(){
      // this.mScrollbarService.destroy(document.body);
    }
}
