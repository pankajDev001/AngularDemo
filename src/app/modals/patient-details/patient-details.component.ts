import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss']
})
export class PatientDetailsComponent implements OnInit {
  @Input() public patientId;
  patientDetails: any = {};

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.authService.postRequest('patient/get', {PatientId: this.patientId}).then((res) => {
      if( res['status'] ){
        this.patientDetails = res['data'];
      }
      if( !res['status'] ){
        this.toastr.error( res['message'] )
      }
    });
  }

  close(){
    this.modalService.dismissAll();
  }
}
