import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
    collapedSideBar: boolean;

    constructor() {
      document.body.className = "";
    }

    ngOnInit() {}

    receiveCollapsed($event) {
      this.collapedSideBar = $event;
    }
}
