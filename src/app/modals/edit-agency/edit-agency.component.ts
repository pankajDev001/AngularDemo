import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../services/common.service';
@Component({
  selector: 'app-edit-agency',
  templateUrl: './edit-agency.component.html',
  styleUrls: ['./edit-agency.component.scss']
})
export class EditAgencyComponent implements OnInit {
  modalRef: NgbModalRef;
  EditAgencyForm: FormGroup;
  userId;
  public agency: any;
  public agencyTypes: any;
  public states = [];
  public cities = [];
  public zipCodes = [];
  public stateId: number;
  public cityId: number;
  submitted: boolean = false;

  @Input() agencyData;
  @Output() updateAgencyList = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.editFromInit();
    this.getStates();
    this.getAgencyTypes();
    this.userId = this.agencyData.userId;
    const Data = {
      UserId: this.userId
    }
    this.getAgencyEditDetails(Data);
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

  getAgencyTypes() {
    this.authService.postRequest('masterlist', { type: 'AGENCYTYPE' }).then((res) => {
      if (res['status']) {
        this.agencyTypes = res['data'];
      } else {
        this.toastr.error(res['message']);
      }
    });
  }

  getAgencyEditDetails(data) {
    this.authService.postRequest('agency/get', data).then((res) => {
      if (res['status']) {
        this.agency = res['data'].agency;

        let PhoneNumber = this.commonService.deformatPhoneNumber(this.agency.contactNo);
        let FaxNumber = this.commonService.deformatPhoneNumber(this.agency.fax);

        this.EditAgencyForm.patchValue({
          AgencyName: this.agency.agencyName,
          AgencyType: this.agency.agencyTypeId,
          ContactPersonName: this.agency.contactPersonName,
          ContactNumber: (PhoneNumber) ? PhoneNumber : '',
          Fax: (FaxNumber) ? FaxNumber : '',
          Email: this.agency.email,
          Address: this.agency.addressLine,
          City: this.agency.cityId,
          State: this.agency.stateId,
          ZipCode: this.agency.zipCode,
          EmrSystem: this.agency.isEMRSystem,
          EmrSystemName: this.agency.emrSystemName,
          ClinincalNotes: this.agency.isClinicalNotes
        });
        this.stateId = this.EditAgencyForm.value.State;
        this.cityId = this.EditAgencyForm.value.City;
        this.getCities(this.stateId);
        this.getZipcodes(this.stateId, this.cityId);
      } else {
        this.toastr.error(res['message']);
      }
    });
  }

  editFromInit() {
    this.EditAgencyForm = this.formBuilder.group({
      AgencyName: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z\s\. ]*$'),
          Validators.minLength(2),
          Validators.maxLength(25)
        ]
      ],
      ContactPersonName: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z\s\. ]*$'),
          Validators.minLength(2),
          Validators.maxLength(25)
        ]
      ],
      ContactNumber: ['',
        [
          Validators.required,
          Validators.pattern('([0-9]{0,})'),
          Validators.minLength(10),
          Validators.maxLength(10)
        ]
      ],
      AgencyType: ['', Validators.required],
      Fax: ['',
        [
          Validators.required,
          Validators.pattern('([0-9]{0,})'),
          Validators.minLength(10),
          Validators.maxLength(10)
        ]
      ],
      Address: ['', Validators.required],
      City: [, Validators.required],
      State: [, Validators.required],
      ZipCode: [, Validators.required],
      EmrSystem: [''],
      EMRSystemName: [''],
      ClinincalNotes: [''],
      Email: [{ value: '', disabled: true },
        [
          Validators.required,
          Validators.email,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$')
        ]
      ]
    });
  }

  close() {
    this.modalService.dismissAll();
  }

  onChangeState(event) {
    if (event.id) {
      this.EditAgencyForm.patchValue({
        City: this.cities[-1],
        ZipCode: this.zipCodes[-1]
      });
      this.getCities(event.id);
    }
  }

  onChangeCity(event) {
    if (event.id) {
      this.EditAgencyForm.patchValue({
        ZipCode: this.zipCodes[-1]
      });
      this.getZipcodes(this.stateId, event.id);
    }
  }

  onSubmit() {
    this.submitted = true;
    const controls = this.EditAgencyForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
     //   console.log(name);
      }
    }

    if(!this.EditAgencyForm.valid){
      return;
    }
    else{
      let PhoneNumber = this.commonService.formatPhoneNumber(this.EditAgencyForm.value.ContactNumber);
      let FaxNumber = this.commonService.formatPhoneNumber(this.EditAgencyForm.value.Fax);

      const data = {
        AgencyName: (this.EditAgencyForm.value.AgencyName) ? this.EditAgencyForm.value.AgencyName : '',
        ContactPersonName: (this.EditAgencyForm.value.ContactPersonName) ? this.EditAgencyForm.value.ContactPersonName : '',
        ContactNo: (PhoneNumber) ? PhoneNumber : '',
        AgencyTypeId: (this.EditAgencyForm.value.AgencyType) ? +this.EditAgencyForm.value.AgencyType : '',
        Fax: (FaxNumber) ? FaxNumber : '',
        AddressLine: (this.EditAgencyForm.value.Address) ? this.EditAgencyForm.value.Address : '',
        CityId: (this.EditAgencyForm.value.City) ? +this.EditAgencyForm.value.City : '',
        StateId: (this.EditAgencyForm.value.State) ? +this.EditAgencyForm.value.State : '',
        ZipCode: (this.EditAgencyForm.value.ZipCode.value) ? this.EditAgencyForm.value.ZipCode.value : '',
        IsEMRSystem: this.EditAgencyForm.value.EmrSystem,
        EMRSystemName: this.EditAgencyForm.value.EMRSystemName,
        IsClinicalNotes: this.EditAgencyForm.value.ClinincalNotes,
        UserId: this.userId,
      }
      this.authService.updateRequest('agency/update', data).then((res) => {
        if (res['status']) {
          this.close();
          this.updateAgencyList.emit();
          this.toastr.success(res['message']);
        }
      });
    }
  }
}
