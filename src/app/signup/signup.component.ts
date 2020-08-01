import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../router.animations';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../services/common.service';
import {Route, Router} from '@angular/router';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    animations: [routerTransition()]
})
export class SignupComponent implements OnInit {
    submitted: boolean = false;
    agenciesType = [];
    states = [];
    cities = [];
    zipcodes = [];
    stateId: number;
    cityId: number;
    signupForm: FormGroup;

    constructor(
      private titleService: Title,
      private authService: AuthService,
      private toastr: ToastrService,
      private formBuilder: FormBuilder,
      private commonService: CommonService,
      private router: Router
    ) {}

    ngOnInit() {
      this.titleService.setTitle('HomeHealthPro | Agency Sign up');

      this.getAgencyTypeList();
      this.getStateList();

      this.signupForm = this.formBuilder.group({
        AgencyName: ['',
          [
            Validators.required,
            Validators.pattern('^[a-zA-Z\s\. ]*$'),
            Validators.minLength(2),
            Validators.maxLength(25)
          ]
        ],
        AgencyTypeId: [, Validators.required],
        ContactPersonName: ['',
          [
            Validators.required,
            Validators.pattern('^[a-zA-Z\s\. ]*$'),
            Validators.minLength(2),
            Validators.maxLength(25)
          ]
        ],
        Email: ['',
          [
            Validators.required,
            Validators.email,
            Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
          ]
        ],
        ContactNo: ['',
          [
            Validators.required,
            Validators.pattern('([0-9]{0,})'),
            Validators.minLength(10),
            Validators.maxLength(10)
          ]
        ],
        Fax: ['',
          [
            Validators.required,
            Validators.pattern('([0-9]{0,})'),
            Validators.minLength(10),
            Validators.maxLength(10)
          ]
        ],
        AddressLine: ['', Validators.required],
        StateId: [, Validators.required],
        CityId: [, Validators.required],
        ZipCode: [, Validators.required],
        IsEMRSystem: [true, Validators.required],
        EMRSystemName: [''],
        IsClinicalNotes: [''],
        TermsConditions: [, Validators.required],
        Password: ['',
          [
            Validators.required,
            Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d.*)(?=.*\\W.*)[a-zA-Z0-9\\S]{8,}$')
          ]
        ],
        ConfirmPassword: ['',
          [
            Validators.required
          ]
        ],
      },
      {
        validator: this.commonService.matchingPasswords('Password', 'ConfirmPassword')
      });
    }

    onSubmit(){
      this.submitted = true;

      if(!this.signupForm.valid){
        return;
      }
      else{
        let PhoneNumber = this.commonService.formatPhoneNumber(this.signupForm.value.ContactNo);
        let FaxNumber = this.commonService.formatPhoneNumber(this.signupForm.value.Fax);

        const data = {
          AgencyName: this.signupForm.value.AgencyName,
          AgencyTypeId: this.signupForm.value.AgencyTypeId.id,
          ContactPersonName: this.signupForm.value.ContactPersonName,
          Email: this.signupForm.value.Email,
          ContactNo: PhoneNumber,
          Fax: FaxNumber,
          AddressLine: this.signupForm.value.AddressLine,
          CityId: this.signupForm.value.CityId.id,
          StateId: this.signupForm.value.StateId.id,
          ZipCode: this.signupForm.value.ZipCode.value,
          Password: this.signupForm.value.Password,
          IsEMRSystem: this.signupForm.value.IsEMRSystem,
          EMRSystemName: this.signupForm.value.EMRSystemName,
          IsClinicalNotes: this.signupForm.value.IsClinicalNotes
        }

        this.authService.postRequest('agency/add', data).then((res) => {
          if( res['status'] ){
            this.toastr.success( res['message'] );
            this.router.navigate(['/login']);
          }
          if( !res['status'] ){
            this.toastr.error( res['message'] );
          }
        });
      }
    }

    getAgencyTypeList(){
      this.authService.postRequest('masterlist', {TYPE: 'AGENCYTYPE'}).then((res) => {
        if( res['status'] ){
          this.agenciesType = res['data'];
        }
        if( !res['status'] ){
          this.toastr.error( res['message'] );
        }
      });
    }

    getStateList(){
      this.authService.postRequest('masterlist', {TYPE: 'STATE'}).then((res) => {
        if( res['status'] ){
          this.states = res['data'];
        }
        if( !res['status'] ){
          this.toastr.error( res['message'] );
        }
      });
    }

    getCityList(event){
      this.stateId = event.id;
      this.cities = [];
      this.zipcodes = [];
      this.authService.postRequest('masterlist', {TYPE: 'CITY', StateId: event.id}).then((res) => {
        if( res['status'] ){
          this.cities = res['data'];
        }
        if( !res['status'] ){
          this.toastr.error( res['message'] );
        }
      });
    }

    getZipcodeList(event){
      this.authService.postRequest('masterlist', {TYPE: 'ZIPCODE', StateId: this.stateId, cityId: event.id}).then((res) => {
        if( res['status'] ){
          this.zipcodes = res['data'];
        }
        if( !res['status'] ){
          this.toastr.error( res['message'] );
        }
      });
    }

  setVal(e){

    if(this.signupForm.controls.IsEMRSystem.value)
      this.signupForm.controls.IsClinicalNotes.setValidators([Validators.required]);
    else
      this.signupForm.controls.IsClinicalNotes.setValidators(null);

  }
}
