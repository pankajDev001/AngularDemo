import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgbDatepickerConfig, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {AuthService} from '../../services/auth.service';
import {DatePipe} from '@angular/common';
import {CommonService} from '../../services/common.service';

@Component({
  selector: 'app-edit-clinician',
  templateUrl: './edit-clinician.component.html',
  styleUrls: ['./edit-clinician.component.scss']
})
export class EditClinicianComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('user'));

  modalRef: NgbModalRef;
  editClinicianForm: FormGroup;
  submitted: boolean = false;
  public date;
  public states = [];
  public cities = [];
  public zipCodes = [];
  public patientTypeList = [];
  public stateId: number;
  public cityId: number;
  gender = [
    { name: 'Male' },
    { name: 'Female' }
  ]
  maxDate = undefined;

  @Input() clinicianData;
  @Output() updateCliniciansList = new EventEmitter();
  getDate = new Date();
  day = this.getDate.getDate()
  month = this.getDate.getMonth() + 1
  year = this.getDate.getFullYear()
  today = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day:new Date().getDate()};
  constructor(private modalService: NgbModal,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private toastr: ToastrService, private datePipe: DatePipe,
              private dateConfig: NgbDatepickerConfig,public commonService: CommonService) { }

  ngOnInit() {
    const currentDate = new Date();
    this.maxDate = {
      year: currentDate.getFullYear() - 10,
      month: currentDate.getMonth() + 1,
      day: currentDate.getDate()
    };
    this.dateConfig.maxDate = { year: this.maxDate.year, month: this.maxDate.month, day: this.maxDate.day };
    this.dateConfig.outsideDays = 'hidden';

    this.getStates();
    this.getPatientType();
    this.editFromInit();


    this.setFormValues();
  }


  setFormValues(){
    this.authService.postRequest('clinician/get', {userId : this.clinicianData.userId}).then((res) => {
      if (res['status']) {
        this.clinicianData = res['data']['clinician'];
        this.clinicianData.stateId = this.clinicianData.stateId ? this.clinicianData.stateId : null;

        let date = this.clinicianData.dob ? new Date(this.clinicianData.dob) : null;

        this.date = this.datePipe.transform(this.clinicianData.dob, 'MM/dd/yyyy');
        this.clinicianData.dob = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
        this.onChangeState({id: this.clinicianData.stateId});
        this.clinicianData.cityId = this.clinicianData.cityId ? this.clinicianData.cityId : null;
        this.clinicianData.zipCode = this.clinicianData.zipCode ? this.clinicianData.zipCode : null;
        this.clinicianData.patientTypeId = this.clinicianData.patientTypeId ? this.clinicianData.patientTypeId : null;
        this.editClinicianForm.patchValue(this.clinicianData);
      }
    });
  }

  get f() { return this.editClinicianForm.controls; }

  editFromInit() {
    this.editClinicianForm = this.formBuilder.group({
      userId: [''],
      firstName: ['',
        [Validators.required,
          this.commonService.noWhitespaceValidator,
          Validators.pattern('^[a-zA-Z\']+$'),
          Validators.minLength(2),
          Validators.maxLength(25)]],
      lastName: ['',
        [ Validators.required,
          this.commonService.noWhitespaceValidator,
          Validators.pattern('^[a-zA-Z\']+$'),
          Validators.minLength(2),
          Validators.maxLength(25)]],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      addressLine: ['', Validators.required],
      cityId: ['', Validators.required],
      stateId: ['', Validators.required],
      zipCode: ['', Validators.required],
      contactNo: ['', Validators.required],
      alternateContactNo: ['', Validators.required,],
      patientTypeId: ['', Validators.required]
    });
  }

  close() {
    this.modalService.dismissAll();
  }

  getStates() {
    this.authService.postRequest('masterlist', { Type: 'STATE' }).then((res) => {
      if (res['status']) {
        this.states = res['data'];
      }
    });
  }

  getCities(stateId) {
    this.stateId = stateId;
    this.authService.postRequest('masterlist', { Type: 'CITY', StateId: stateId }).then((res) => {
      if (res['status']) {
        this.cities = res['data'];
      }
    });
  }

  getZipcodes(stateId, cityId) {
    this.authService.postRequest('masterlist', { Type: 'ZIPCODE', StateId: stateId, CityId: cityId }).then((res) => {
      if (res['status']) {
        this.zipCodes = res['data'];
      }
    });
  }

  getPatientType() {
    this.authService.postRequest('masterlist', { Type: 'PATIENTTYPE'}).then((res) => {
      if (res['status']) {
        this.patientTypeList = res['data'];

        if (this.user.role == 'AGENCY') {
          let index = this.patientTypeList.findIndex(x => x.id == 3);
          this.patientTypeList.splice(index);
        }
      }
    });
  }

  onChangeState(event) {
    if (event.id) {
      this.editClinicianForm.patchValue({
        cityId: this.cities[-1],
        zipCode: this.zipCodes[-1]
      });
      this.getCities(event.id);
    }
  }

  onChangeCity(event) {
    if (event.id) {
      this.editClinicianForm.patchValue({
        zipCode: this.zipCodes[-1]
      });
      this.getZipcodes(this.stateId, event.id);
    }
  }

  onDateSelect($event) {
    const dob = this.editClinicianForm.value.dob.year + '-' + this.editClinicianForm.value.dob.month + '-' + this.editClinicianForm.value.dob.day;
    this.date = this.datePipe.transform(dob, 'MM/dd/yyyy');
  }

  onSubmit() {

    this.submitted = true;
    if(!this.editClinicianForm.valid){
      return;
    }else{
      let obj = this.editClinicianForm.value;

      obj.dob = this.date;
      //  obj.zipCode = obj.zipCode.value;

      this.authService.updateRequest('clinician/update', obj).then((res) => {
        if (res['status']) {
          this.close();
          this.updateCliniciansList.emit();
          this.toastr.success(res['message']);
        }
      });
    }
  }


}
