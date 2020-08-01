import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../../services/auth.service';
import {CommonService} from '../../services/common.service';

@Component({
  selector: 'app-ratings-review',
  templateUrl: './ratings-review.component.html',
  styleUrls: ['./ratings-review.component.scss']
})
export class RatingsReviewComponent implements OnInit {
  @Input() clinicianData;
  @Output() updateCliniciansList = new EventEmitter();
  reviews_list: any = [];
  reviews_type: string = 'ATC'
  constructor(private modalService: NgbModal,
              private authService: AuthService,
              public commonService: CommonService) {
  }

  ngOnInit() {
    this.reviews_type = this.clinicianData.review_type;
    this.getReviews(this.reviews_type);
  }


  getReviews(type) {
    this.reviews_type = type;
    this.authService.postRequest('reviewrating/get', {
      ToProfileId: this.clinicianData.profile_id,
      VisitId: "",
      ReviewFor: type
    }).then((res) => {
      if (res['status']) {
        this.reviews_list[type] = res['data'];
      }
    });
  }

  open(){
    this.modalService.open({ariaLabelledBy: 'ratings-review-modal'});
  }

  close(){
    this.modalService.dismissAll();
  }
}
