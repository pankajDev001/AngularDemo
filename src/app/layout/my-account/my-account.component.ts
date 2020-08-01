import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import {FormBuilder, FormGroup, ValidationErrors, Validators, FormControl} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UpdateProfileImageComponent } from 'src/app/modals/update-profile-image/update-profile-image.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.scss'],
  animations: [routerTransition()]
})
export class MyAccountComponent implements OnInit {
  public contentUrl = environment.host_url;
  public userId = localStorage.getItem('userId');
  public userRole = JSON.parse( localStorage.getItem('user') );
  public userDetails = <any>{};
  public bankDetails = <any>{};
  public adminFeesDetails = <any>{};
  public date;
  public disable:boolean = false;
  public disableChangePassword:boolean = true;
  agenciesType = [];
  states = [];
  cities = [];
  zipcodes = [];
  stateId: number;
  cityId: number;
  maxDate = undefined;
  editAccountForm: FormGroup;
  editAgencyForm: FormGroup;
  changePassword: FormGroup;
  gender = [
    { name: 'Male' },
    { name: 'Female' }
  ];
  modalRef: NgbModalRef;
  submitted1 = false;
  submitted = false;
  // Upload Profile Image
  selectedFile: File = null;
  @Output() selectedProfileImage = new EventEmitter();
  @Input() public uploadedProfileImage;

  fieldTextType: boolean;
  fieldTextType2: boolean;
  fieldTextType3: boolean;
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private dateConfig: NgbDatepickerConfig,
    private commonService: CommonService,
    private modalService: NgbModal,
    private titleService: Title
  ) {

    // Disable Future Dates
    const currentDate = new Date();
    this.maxDate = {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      day: currentDate.getDate()
    };
    this.dateConfig.maxDate = {year: this.maxDate.year, month: this.maxDate.month, day: this.maxDate.day};
    this.dateConfig.outsideDays = 'hidden';
  }

  ngOnInit() {
    this.titleService.setTitle('HomeHealthPro | My Account');
    const data = {
      userId: localStorage.getItem('userId'),
      Role: this.userRole.role
    }
    if(this.userRole.role != 'AGENCY') {

      this.getUserDetails(data);
      this.editAccountFormInit();
    }else{
      this.getAgencyTypeList();
      this.getStateList();
      this.getAgencyDetails(data);
      this.editAccountFormInitForAgency();
    }
    this.changePasswordForm();
  }

  getUserDetails(data){
    this.authService.postRequest('admin/get', data).then((res) => {
      if( res['status'] ){
        this.userDetails = res['data'].user;
        this.bankDetails = res['data'].bankDetails;
        this.adminFeesDetails = res['data'].adminProcessingFee;
        this.updateEditForm();
      }
    });
  }

  getAgencyDetails(data){
    this.authService.postRequest('agency/get', data).then((res) => {
      if( res['status'] ){
        this.userDetails = res['data'].agency;
        this.bankDetails = res['data'].agencyBankDetails;
        this.updateEditAgencyForm();
      }
    });
  }

  editAccountFormInitForAgency(){
    this.editAgencyForm = this.formBuilder.group({
      agencyName: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z\s\. ]*$'),
          Validators.minLength(2),
          Validators.maxLength(25)
        ]
      ],
      agencyTypeId: [, Validators.required],
      contactPersonName: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z\s\. ]*$'),
          Validators.minLength(2),
          Validators.maxLength(25)
        ]
      ],
      contactNo: ['',
        [
          Validators.required,
        ]
      ],
      fax: ['',
        [
          Validators.required,
        ]
      ],
      addressLine: ['', Validators.required],
      stateId: [, Validators.required],
      cityId: [, Validators.required],
      zipCode: [, Validators.required],
      accountHolderName: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z\s\. ]*$'),
          Validators.minLength(2),
          Validators.maxLength(25)
        ]
      ],
      accountNumber: ['',
        [
          Validators.required,
          Validators.pattern('^[0-9]{12}'),
        ]
      ],
      routingNumber: ['',
        [
          Validators.required,
          Validators.pattern('^[0-9]{9}'),
        ]
      ],
      // swift_BicCode:['',
      //   [
      //     Validators.required,
      //     Validators.pattern('[A-Z0-9]{8,11}'),
      //     Validators.minLength(8),
      //     Validators.maxLength(11)
      //   ]
      // ],
      bankName: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z\s\. ]*$'),
          Validators.minLength(2),
          Validators.maxLength(25)
        ]
      ],
      // bankAddress: ['', Validators.required],
    });
  }

  editAccountFormInit(){
    this.editAccountForm = this.formBuilder.group({
      FirstName: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z\s\. ]*$'),
        Validators.minLength(2),
        Validators.maxLength(25)
      ]],
      LastName: ['',[
        Validators.required,
        Validators.pattern('^[a-zA-Z\s\. ]*$'),
        Validators.minLength(2),
        Validators.maxLength(25)
      ]],
      Gender: [, Validators.required],
      DOB: [''],
      Email: ['',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
        ]
      ],
      ContactNo: ['', Validators.required],
      JobTitle: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z\s\. ]*$'),
        Validators.minLength(2),
        Validators.maxLength(25)
      ]],
      AccountHolderName: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z\s\. ]*$'),
          Validators.minLength(2),
          Validators.maxLength(25)
        ]
      ],
      AccountNumber: ['',
        [
          Validators.required,
          Validators.pattern('^[0-9]{12}'),
        ]
      ],
      RoutingNumber: ['',
        [
          Validators.required,
          Validators.pattern('^[0-9]{9}'),
        ]
      ],
      // Code:['',
      //   [
      //     Validators.required,
      //     Validators.pattern('[A-Z0-9]{8,11}'),
      //     Validators.minLength(8),
      //     Validators.maxLength(11)
      //   ]
      // ],
      BankName: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z\s\. ]*$'),
          Validators.minLength(2),
          Validators.maxLength(25)
        ]
      ],
      // BankAddress: ['', Validators.required],
      AgencyFeeAmt: ['', [Validators.required, Validators.pattern('^(?:[1-9][0-9]{0,3}(?:\\.\\d{1,2})?|999|999.00)$')]],
      AgencyFeePerCentage: ['', [Validators.required, Validators.pattern('^100$|^[0-9]{1,2}$|^[0-9]{1,2}\\,[0-9]{1,3}$')]],
      ClinicianFeeAmt: ['', [Validators.required, Validators.pattern('^(?:[1-9][0-9]{0,3}(?:\\.\\d{1,2})?|999|999.00)$')]],
      ClinicianFeePerCentage: ['', [Validators.required, Validators.pattern('^100$|^[0-9]{1,2}$|^[0-9]{1,2}\\,[0-9]{1,3}$')]]
    });
  }

  updateEditAgencyForm(){
    this.userDetails.agencyTypeId = {id: this.userDetails.agencyTypeId, value: this.userDetails.agencyType};
    this.userDetails.stateId = {id: this.userDetails.stateId, value: this.userDetails.state};
    this.userDetails.cityId = {id: this.userDetails.cityId, value: this.userDetails.city};
    this.userDetails.zipCode = {id: this.userDetails.zipCode, value: this.userDetails.zipCode};
    let merged = {...this.userDetails, ...this.bankDetails};
    this.getCityList({id: this.userDetails.stateId ? this.userDetails.stateId.id : null})
    this.getZipcodeList({id:this.userDetails.cityId ? this.userDetails.cityId.id : null, value: this.userDetails.city})
    this.editAgencyForm.patchValue(merged);
    this.editAgencyForm.disable();
  }


  updateEditForm(){
    let date = this.userDetails.dob.split('/');
    this.date = {
      year: parseInt(date[2]),
      month: parseInt(date[0]),
      day: parseInt(date[1])};
    this.editAccountForm.patchValue({
      FirstName: this.userDetails ? this.userDetails.firstName : '',
      LastName: this.userDetails ? this.userDetails.lastName : '',
      Gender: this.userDetails ? this.userDetails.gender : '',
      DOB: this.date ? this.date : '',
      Email: this.userDetails ? this.userDetails.email : '',
      ContactNo: this.userDetails ? this.userDetails.contactNo : '',
      JobTitle: this.userDetails ? this.userDetails.jobTitle : '',
      AccountHolderName: this.bankDetails ? this.bankDetails.accountHolderName : '',
      AccountNumber: this.bankDetails ? this.bankDetails.accountNumber : '',
      RoutingNumber: this.bankDetails ? this.bankDetails.routingNumber : '',
      // Code: this.bankDetails ? this.bankDetails.swift_BicCode : '',
      BankName: this.bankDetails ? this.bankDetails.bankName: '',
      // BankAddress: this.bankDetails ? this.bankDetails.bankAddress : '',
      AgencyFeeAmt: this.adminFeesDetails ? this.adminFeesDetails.agencyFeeAmt : 0,
      AgencyFeePerCentage: this.adminFeesDetails ? this.adminFeesDetails.agencyFeePerCentage : 0,
      ClinicianFeeAmt: this.adminFeesDetails ? this.adminFeesDetails.clinicianFeeAmt : 0,
      ClinicianFeePerCentage: this.adminFeesDetails ? this.adminFeesDetails.clinicianFeePerCentage : 0
    });
    this.editAccountForm.disable();
  }

  changePasswordForm(){
    this.changePassword = this.formBuilder.group({
        oldPassword: ['', Validators.required],
        Password: ['',
          [
            Validators.required,
            Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d.*)(?=.*\\W.*)[a-zA-Z0-9\\S]{8,}$')
          ]
        ],
        ConfirmPassword: ['', Validators.required]
      },
      {
        validator: this.commonService.matchingPasswords('Password', 'ConfirmPassword')
      });
    this.changePassword.disable();
  }

  toggleEditForm() {
    if (this.userRole.role != 'AGENCY') {
      this.disable = !this.disable;
      this.disable ? this.editAccountForm.enable() : this.editAccountForm.disable();
      this.editAccountForm.controls.Email.disable();

      //disable bank details for admin user
      if(this.userRole.role == 'ADMIN'){
        this.editAccountForm.controls.AccountHolderName.disable();
        this.editAccountForm.controls.AccountNumber.disable();
        this.editAccountForm.controls.RoutingNumber.disable();
        // this.editAccountForm.controls.Code.disable();
        this.editAccountForm.controls.BankName.disable();
        // this.editAccountForm.controls.BankAddress.disable();

      }

    }else{
      this.disable = !this.disable;
      this.disable ? this.editAgencyForm.enable() : this.editAgencyForm.disable();
    }
  }

  toggleChangePasswordForm(){
    if(this.disableChangePassword){
      this.changePassword.enable()
      this.disableChangePassword = false
    }
    else{
      this.changePassword.disable()
      this.disableChangePassword = true
    }
  }



  editFormSubmit(){
    const invalid = [];
    const controls = this.editAccountForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    this.submitted = true;
    if(!this.editAccountForm.valid) {
      return;
    }else{
      const data = {
        UserId: this.userId,
        Role: this.userRole.role,
        Active: true,
        FirstName: this.editAccountForm.value.FirstName,
        LastName: this.editAccountForm.value.LastName,
        JobTitle: this.editAccountForm.value.JobTitle,
        Email: this.editAccountForm.value.Email,
        ContactNo: this.editAccountForm.value.ContactNo,
        Gender: this.editAccountForm.value.Gender,
        DOB:  this.editAccountForm.value.DOB ?  this.editAccountForm.value.DOB.month+'/'+ this.editAccountForm.value.DOB.day+'/'+ this.editAccountForm.value.DOB.year : null,
        BankDetails: {
          AccountHolderName: this.editAccountForm.value.AccountHolderName,
          AccountNumber: this.editAccountForm.value.AccountNumber,
          RoutingNumber: this.editAccountForm.value.RoutingNumber,
          Swift_BicCode: null,
          BankName: this.editAccountForm.value.BankName,
          BankAddress: null
        },
        AdminProcessingFee: {
          AgencyFeeAmt: parseFloat(this.editAccountForm.value.AgencyFeeAmt),
          AgencyFeePerCentage: parseFloat(this.editAccountForm.value.AgencyFeePerCentage),
          ClinicianFeeAmt: parseFloat(this.editAccountForm.value.ClinicianFeeAmt),
          ClinicianFeePerCentage: parseFloat(this.editAccountForm.value.ClinicianFeePerCentage)
        }
      }
      this.authService.updateRequest('admin/profile/update', data).then((res) => {
        if (res['status']) {
          this.toastr.success(res['message']);
          this.getUserDetails(data);
        }
        else {
          this.toastr.error(res['message']);
        }
      });
    }
  }

  editAgencyFormSubmit(){

    this.submitted = true;
    if (this.editAgencyForm.valid){

      let data = this.editAgencyForm.value;
      const obj  = {
        agencyBankDetails: {
          AccountHolderName: data.accountHolderName,
          AccountNumber: data.accountNumber,
          RoutingNumber: data.routingNumber,
          Swift_BicCode: null,
          BankName: data.bankName,
          BankAddress: null
        },
        agency: {
          userId: this.userDetails.userId,
          agencyName: data.agencyName,
          agencyTypeId: data.agencyTypeId ? data.agencyTypeId.id : null,
          addressLine: data.addressLine,
          cityId: data.cityId.id,
          stateId: data.stateId ? data.stateId.id : null,
          zipCode: data.zipCode ? data.zipCode.id.toString() : null,
          contactPersonName: data.contactPersonName,
          contactNo: data.contactNo,
          fax: data.fax,
          isEMRSystem: true,
          isClinicalNotes: true

        }
      };

      this.authService.updateRequest('agency/profile/update', obj).then((res) => {
        if (res['status']) {
          this.toastr.success(res['message']);
        }
        else {
          this.toastr.error(res['message']);
        }
      });
    }

    }
    changePasswordSubmit(){
      this.submitted1 = true;
      if(this.changePassword.valid){
        const data = {
          Email : this.userDetails.email,
          OldPassword : this.changePassword.value.oldPassword,
          Password : this.changePassword.value.Password,
          ConfirmPassword : this.changePassword.value.ConfirmPassword
        }

        this.authService.postRequest('user/password/change', data).then((res) => {
          if( res['status'] ){
            this.toastr.success( res['message'] );
            this.changePassword.reset();
          }
          else{
            this.toastr.error( res['message'] );
          }
        });
      }
    }

    onFileSelect($event){
      this.modalRef = this.modalService.open(UpdateProfileImageComponent, {ariaLabelledBy: 'update-profile-image', centered: true});
      this.modalRef.componentInstance.selectedProfileImage = {event: $event, userId: this.userId};
      this.modalRef.componentInstance.uploadedProfileImage.subscribe((updatedImage) => {
        this.userDetails.profileImage = updatedImage;
        this.commonService.sendDataToOtherComponent(updatedImage);
      });
    }

    close(){
      this.modalService.dismissAll();
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

          let zip = this.zipcodes.filter(item => item.id == event.id);

          this.editAgencyForm.patchValue({zipCode: zip ? zip[0] : null});
        }
        if( !res['status'] ){
          this.toastr.error( res['message'] );
        }
      });
    }

    onOldPassword() {
      this.fieldTextType = !this.fieldTextType;
    }
    onNewPassword() {
      this.fieldTextType2 = !this.fieldTextType2;
    }
    onConfirmPassword() {
      this.fieldTextType3 = !this.fieldTextType3;
    }
  }
