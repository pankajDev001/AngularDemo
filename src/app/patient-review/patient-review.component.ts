import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {Title} from '@angular/platform-browser';
import {CommonService} from '../services/common.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-patient-review',
  templateUrl: './patient-review.component.html',
  styleUrls: ['./patient-review.component.scss']
})
export class PatientReviewComponent implements OnInit {
  reviewForm: FormGroup;
  visitData: any = {};
  submitted = false;
  isThakYou = false;
  constructor(
    private titleService: Title,
    private authService: AuthService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private router: ActivatedRoute,
    private route: Router
  ) {
    this.reviewForm = this.formBuilder.group({
      patientName: [{value:'', disabled: true}],
      clinicianName: [{value:'', disabled: true}],
      visitDate: [{value:'', disabled: true}],
      rating: ['', Validators.required],
      reviewDesc: ['', Validators.required],
    });
    this.router.params.subscribe( params => {
      if(params)
      {
        this.authService.postRequest('visit/patientreview/get', params).then((res) => {
          if( res['status'] ){
            this.visitData = res['data'];
            this.visitData.visitId = params.visitId;
            this.reviewForm.patchValue(this.visitData);
          }
          if( !res['status'] ){
            this.toastr.error( res['message'] );
          }
        });
      }
    });

    // visit/patientreview/get

  }

  ngOnInit() {

  }

  onSubmit(){
    this.submitted = true;

    let data = this.reviewForm.value
    if(this.reviewForm.valid){
      this.authService.postRequest('reviewrating/patientreview/add', {VisitId: this.visitData.visitId, Rating: data.rating, Review: data.reviewDesc }).then((res) => {
        if( res['status'] ){
          this.toastr.success( res['message'] );
         // this.route.navigate(['/login']);
        //  this.reviewForm.reset();
            this.isThakYou = true;
        }

        if( !res['status'] ){
          this.toastr.error( res['message'] );
        }
      });
    }
  }


  onRate(e){
    this.reviewForm.controls.rating.setValue(e.newValue);
  }
}
