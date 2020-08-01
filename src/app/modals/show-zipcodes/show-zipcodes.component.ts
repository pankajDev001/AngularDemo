import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-show-zipcodes',
  templateUrl: './show-zipcodes.component.html',
  styleUrls: ['./show-zipcodes.component.scss']
})
export class ShowZipcodesComponent implements OnInit {
  @Input() zipCodes: any = '';

  constructor(private modalService: NgbModal) { }

  ngOnInit() {


  }
  removeLastComma(str) {
    return str.replace(/,(\s+)?$/, '');
  }

  close(){
    this.modalService.dismissAll();
  }
}
