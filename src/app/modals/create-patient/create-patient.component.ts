import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-create-patient',
  templateUrl: './create-patient.component.html',
  styleUrls: ['./create-patient.component.scss']
})
export class CreatePatientComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('user'));
  createPatientForm: FormGroup;
  gender = [
    {id:'0', value: 'Male'},
    {id:'1', value: 'Female'},
  ];
  patientTypes = [];
  states = [];
  cities = [];
  zipcodes = [];
  stateId: number;
  date;
  submitted = false;
  @Output() updatePatientList = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toaster: ToastrService,
    private dateConfig: NgbDatepickerConfig,
    private datePipe: DatePipe,
    private commonService: CommonService
  ) {
    const current = new Date();
    this.dateConfig.maxDate = { year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate() };
    this.dateConfig.minDate = { year: 1950, month: 1, day: 1 };
    this.dateConfig.startDate = { year: 1950, month: 1 }
    this.dateConfig.outsideDays = 'hidden';
  }

  ngOnInit() {
    this.createPatientFromInit();
    this.getPatientType();
    this.getStates();
  }

  createPatientFromInit(){
    this.createPatientForm = this.formBuilder.group({
      PatientName: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z\\.\\-\'\s ]+$'),
        ]
      ],
      PatientDOB: ['',
        [
          Validators.required
        ]
      ],
      PatientType: [this.patientTypes[-1],
        [
          Validators.required
        ]
      ],
      PatientEmail: ['',
        [
          // Validators.required,
          Validators.email,
          Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
        ]
      ],
      PatientPhone: ['',
        [
          Validators.required,
          Validators.pattern('([0-9]{0,})'),
          Validators.minLength(10),
          Validators.maxLength(10)
        ]
      ],
      PatientEmergencyContactName: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z\\.\\-\'\s ]+$'),
        ]
      ],
      PatientEmergencyContactPhone: ['',
        [
          Validators.required,
          Validators.pattern('([0-9]{0,})'),
          Validators.minLength(10),
          Validators.maxLength(10)
        ]
      ],
      PatientGender: [this.gender[-1],
        [
          Validators.required
        ]
      ],
      PatientAddressLine: ['',
        [
          Validators.required
        ]
      ],
      State: [this.states[-1],
        [
          Validators.required
        ]
      ],
      City: [this.cities[-1],
        [
          Validators.required
        ]
      ],
      Zipcode: [this.zipcodes[-1],
        [
          Validators.required
        ]
      ],
      Diagnosis: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z\\.\\-\'\s ]+$'),
        ]
      ],
      InsuranceType: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z\\.\\-\'\s ]+$'),
        ]
      ]
    });
  }

  getPatientType(){
    this.authService.postRequest('masterlist', {Type: 'PatientType'}).then((res)=>{
      if( res['status'] ){
        this.patientTypes = res['data'];
        if (this.user.role == 'AGENCY') {
          let index = this.patientTypes.findIndex(x => x.id == 3);
          this.patientTypes.splice(index);
        }
      }
      if( !res['status'] ){
        this.toaster.error( res['message'] );
      }
    });
  }
  getStates(){
    this.authService.postRequest('masterlist', {Type: 'State'}).then((res)=>{
      if( res['status'] ){
        this.states = res['data'];
      }
      if( !res['status'] ){
        this.toaster.error( res['message'] );
      }
    });
  }
  getCityList(event){
    this.stateId = event.id;
    this.cities = [];
    this.zipcodes = [];
    this.createPatientForm.patchValue({
      City: this.cities[-1],
      Zipcode: this.zipcodes[-1],
    });

    this.authService.postRequest('masterlist', {TYPE: 'CITY', StateId: event.id}).then((res) => {
      if( res['status'] ){
        this.cities = res['data'];
      }
      if( !res['status'] ){
        this.toaster.error( res['message'] );
      }
    });
  }
  getZipcodeList(event){
    this.zipcodes = [];
    this.createPatientForm.patchValue({
      Zipcode: this.zipcodes[-1],
    });
    this.authService.postRequest('masterlist', {TYPE: 'ZIPCODE', StateId: this.stateId, cityId: event.id}).then((res) => {
      if( res['status'] ){
        this.zipcodes = res['data'];
      }
      if( !res['status'] ){
        this.toaster.error( res['message'] );
      }
    });
  }
  onDateSelect() {
    const dob = this.createPatientForm.value.PatientDOB.year + '-' + this.createPatientForm.value.PatientDOB.month + '-' + this.createPatientForm.value.PatientDOB.day;
    this.date = this.datePipe.transform(dob, 'MM/dd/yyyy');
  }

  onSubmit(){
    this.submitted = true;
    if(!this.createPatientForm.valid){
      return;
    }
    else{
      let PhoneNumber = this.commonService.formatPhoneNumber(this.createPatientForm.value.PatientPhone);
    let EmergencyPhoneNumber = this.commonService.formatPhoneNumber(this.createPatientForm.value.PatientEmergencyContactPhone);
    const data = {
      Name: this.createPatientForm.value.PatientName,
      DOB: this.date,
      PatientTypeId: this.createPatientForm.value.PatientType,
      Phone: PhoneNumber,
      EmergencyContactName: this.createPatientForm.value.PatientEmergencyContactName,
      EmergencyContactNo: EmergencyPhoneNumber,
      Gender: this.createPatientForm.value.PatientGender,
      Email: this.createPatientForm.value.PatientEmail? this.createPatientForm.value.PatientEmail : '',
      Address: this.createPatientForm.value.PatientAddressLine,
      CityId: this.createPatientForm.value.City,
      StateId: this.createPatientForm.value.State,
      Zipcode: this.createPatientForm.value.Zipcode,
      InsuranceType: this.createPatientForm.value.InsuranceType,
      Diagnosis: this.createPatientForm.value.Diagnosis
    }
    this.authService.postRequest('patient/add', data).then((res)=>{
      if( res['status'] ){
        this.toaster.success( res['message'] );
        this.modalService.dismissAll();
        this.updatePatientList.emit();
      }
      if( !res['status'] ){
        this.toaster.error( res['message'] );
      }
    });
    }
    
  }

  close() {
    this.modalService.dismissAll();
  }
}
