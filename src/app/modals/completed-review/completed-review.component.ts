import { Component, OnInit, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-completed-review',
  templateUrl: './completed-review.component.html',
  styleUrls: ['./completed-review.component.scss']
})
export class CompletedReviewComponent implements OnInit {
  @Input() public review;
  reviewDetails: any = [];
  submit: boolean = false;
  reviewDesc: string = '';
  reviewRate: number = 0;
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
      this.authService.postRequest('reviewrating/get', { ToProfileId: this.review.profileId, VisitId: this.review.visitId, ReviewFor: this.review.reviewFor }).then((res) => {
        if ( res['status'] ) {
          this.reviewDetails = res['data'][0];
          console.log(this.reviewDetails);
        }
        if( !res['status'] ){
          this.toastr.error( res['message'] );
        }
      });
  }


  close(){
    this.modalService.dismissAll();
  }


}
