import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-reschedule-visit',
  templateUrl: './reschedule-visit.component.html',
  styleUrls: ['./reschedule-visit.component.scss']
})
export class RescheduleVisitComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('user'));

  @Input() public visitId;
  @Output() updateVisitList = new EventEmitter();

  submit: boolean = false;
  reason: any;
  visitDate: any;
  today = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day:new Date().getDate()};

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

  submitVisit(){

    this.submit = true;

    if(this.reason && this.visitDate){

      this.authService.postRequest('visit/reschedule',
        {
          visitId: this.visitId,
          clinicianId: "",
          agencyId: this.user ? this.user.profileId : '',
          isVisitRescheduled: true,
          newVisitDate: this.visitDate ? this.visitDate.month + '/' + this.visitDate.day + '/' + this.visitDate.year : '',
          reason: this.reason
        }).then(res => {

        if(res['status'])
        {
          this.toastr.success(res['message']);
          this.close();
          this.updateVisitList.emit(true);
        }

      });
    }
  }

}
