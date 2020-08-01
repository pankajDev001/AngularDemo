import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../../services/auth.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-write-review',
  templateUrl: './write-review.component.html',
  styleUrls: ['./write-review.component.scss']
})
export class WriteReviewComponent implements OnInit {
  @Input() public visitId;
  @Output() updateVisitList = new EventEmitter();

  submit: boolean = false;
  reviewDesc: string = '';
  reviewRate: number = 0;
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) {}

  ngOnInit() {
    
  }

  onRate(e){
    this.reviewRate = e.newValue;
  }

  close(){
    this.modalService.dismissAll();
  }


  submitReview(){

    this.submit = true;
    if(!this.reviewDesc)
     return;
    else{
      this.authService.postRequest('reviewrating/add', { VisitId: this.visitId, ReviewFor:'ATC', Rating: this.reviewRate, Review: this.reviewDesc }).then((res) => {
        if ( res['status'] ) {
          this.toastr.success( res['message'] );
          this.close();
          this.updateVisitList.emit(true);

        }
        if( !res['status'] ){
          this.toastr.error( res['message'] );
        }
      });
    }
  }
}
