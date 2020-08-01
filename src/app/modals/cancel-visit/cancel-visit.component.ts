import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DatePipe} from '@angular/common';
import {AuthService} from '../../services/auth.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-cancel-visit',
  templateUrl: './cancel-visit.component.html',
  styleUrls: ['./cancel-visit.component.scss']
})
export class CancelVisitComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('user'));

  @Input() public visitId;
  @Output() cancelVisitReferesh = new EventEmitter();

  submit: boolean = false;
  reason: any;

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    public datePipe: DatePipe
  ) {}

  ngOnInit() {
  }

  close(){
    this.modalService.dismissAll();
  }

  cancelVisit(){

    this.submit = true;

    if(this.reason){

      this.authService.postRequest('visit/cancel',
        {
          visitId: this.visitId,
          clinicianId: "",
          agencyId: this.user ? this.user.profileId : '',
          isVisitCancelled: true,
          reason: this.reason
        }).then(res => {

        if(res['status'])
        {
          this.toastr.success(res['message']);
          this.cancelVisitReferesh.emit(true);
          this.close();
        }
      });
    }
  }
}
