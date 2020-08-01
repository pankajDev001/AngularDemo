import {Component, OnInit, Input, ViewChild} from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-visit-details',
  templateUrl: './visit-details.component.html',
  styleUrls: ['./visit-details.component.scss']
})
export class VisitDetailsComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('user'));
  @Input() public visitId;
  @Input() public type = 'normal';
  @ViewChild('tab',{static:false}) public tab;
  visitDetails: any = {};
  agencyRejectedReason: any = '';
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) {}

  ngOnInit() {

    this.authService.postRequest('visit/get', {VisitId: this.visitId}).then((res) => {
      if( res['status'] ){
        this.visitDetails = res['data'];

        if(this.type == 'notification'){
          this.tab.select('tab-2');
        }
      }
      if( !res['status'] ){
        this.toastr.error( res['message'] )
      }
    })
  }

  approveDoc(type){

    if(type == 'approve') {
      this.authService.updateRequest('visit/onsite/update', {
        VisitId: this.visitId,
        IsAgencyApproved: true,
        AgencyRejectedReason: ''
      }).then((res) => {
        if (res['status']) {
          this.toastr.success(res['message'])
          this.close();
        }
      });
    }else{
      if(this.agencyRejectedReason.trim().length == 0)
      {
        this.toastr.error('Provide a reason to reject document')
        return;
      }
      this.authService.updateRequest('visit/onsite/update', {
        VisitId: this.visitId,
        IsAgencyApproved: false,
        AgencyRejectedReason: this.agencyRejectedReason
      }).then((res) => {
        if (res['status']) {
          this.toastr.success(res['message']);
          this.close();

        }
      });

    }
  }

  rejectDoc(content){
    this.agencyRejectedReason = '';
    this.modalService.open(content, {ariaLabelledBy: 'ratings-review-modal'}).result.then((result) => {
      console.log(result);
    }, (reason) => {
      console.log(reason);
    });

  }

  downloadDoc(item){
    if(item) {
      let a = document.createElement("a");
      document.body.appendChild(a);
      a.href = environment.host_url + '' + item.documentPath;
      a.download = item.downloadName;
      a.target = '_blank';
      a.click();
      document.body.removeChild(a);
    }
  }

  close(){
    this.modalService.dismissAll();
  }


}
