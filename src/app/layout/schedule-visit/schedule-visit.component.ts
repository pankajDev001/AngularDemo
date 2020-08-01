import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { routerTransition } from 'src/app/router.animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import {NgbDatepickerConfig, NgbDate, NgbModalRef, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { CommonService } from '../../services/common.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MapsAPILoader} from '@agm/core';
import {environment} from '../../../environments/environment';
import {zip} from 'rxjs';
declare var google;

interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
  content?:string;
  isShown:boolean;
  icon:string;
}


@Component({
  selector: 'app-schedule-visit',
  templateUrl: './schedule-visit.component.html',
  styleUrls: ['./schedule-visit.component.scss'],
  animations: [routerTransition()]
})
export class ScheduleVisitComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('user'));
  scheduleVisitForm: FormGroup;
  @ViewChild('myCalendar',{static: false}) datePicker;

  close() {
    this.datePicker.overlayVisible = false;
  }

  patient_gender= [
    {id:'0', value: 'Male'},
    {id:'1', value: 'Female'},

  ];
  gender = [
    {id:'0', value: 'Male'},
    {id:'1', value: 'Female'},
    {id:'2', value: 'No Preference'},

  ];
  schedulePreference = [
    {id: '0', value: 'Days'},
    {id: '1', value: 'Hours'}
  ]
  patientTypes = [];
  states = [];
  cities = [];
  zipcodes = [];
  stateId: number;
  categories = [];
  services = [];
  languages = [];
  visitfrequency_list = [];
  schedulepreference_list = [];
  authStartDate;
  authEndDate;
  authStartDateNgb: NgbDate;
  authEndDateNgb: NgbDate;

  cpStartDate;
  cpEndDate;
  cpStartDateNgb: NgbDate;
  cpEndDateNgb: NgbDate;


  getDate = new Date();
  day = this.getDate.getDate()
  month = this.getDate.getMonth() + 1
  year = this.getDate.getFullYear()
  today = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day:new Date().getDate()};
  previous_date = new Date();
  previous_date_auth = new Date();
  previous_date_cer = new Date();
  next_date_auth = new Date();
  next_date_cer = new Date();
  visitStartDate = new Date();
  visitStartEnd = new Date();
  minDate = new Date();
  maxDate = new Date();
  type = 0;
  pageSize = 6;

  totalDataCount: number = 0;
  p: number;
  data = {
    Start: 0,
    PageSize: this.pageSize,
    SortCol: "",
    SearchKey: "",
    type: 1 // 0: searchName && sortBy , 1: normal
  };
  nearby_zipcode: any = [];
  Incentives=0;
  VisitZipcode = '';
  VisitFees = '';
  sortBy: any = [{value: 'Visit Fees (Low-High)', id: 'visitfees_asc'},
    {value: 'Visit Fees (High-Low)', id: 'visitfees_desc'},
    {value: 'Ratings (Low-High)', id: 'rating_asc'},
    {value: 'Ratings (High-Low)', id: 'rating_desc'}];
  visitId = '';
  contentUrl = environment.host_url;
  submitted: boolean = false;
  patientdata: any;
  dtOptions: any = {};
  clinicians_list : any = [];
  latitude: number;
  longitude: number;
  zoom:number;
// Radius
  radius = 8046.72;
  radiusLat = 0;
  radiusLong = 0;
  markers: marker[] = [];
  modalRef: NgbModalRef;

  feeRange: any ;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toaster: ToastrService,
    private dateConfig: NgbDatepickerConfig,
    private datePipe: DatePipe,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private mapsAPILoader: MapsAPILoader,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
  ) {
    this.previous_date.setFullYear(this.year - 50);
    this.dateConfig.outsideDays = "collapsed";

  }

  private setCurrentLocation(data:any = []) {
    this.latitude = data.length > 0 ? data[0].lat : 38.907192;
    this.longitude = data.length > 0 ? data[0].lng :  -77.036873;
    this.radiusLat = this.latitude;
    this.radiusLong = this.longitude;
    this.zoom = 10;
    this.markers = [];
    for(let i=0;i< data.length;i++){
      this.markers.push(
        {
          lat: data.length > 0 ? data[i].lat : this.latitude+Math.random(),
          lng: data.length > 0 ? data[i].lng : this.longitude+Math.random(),
          label: `${data[i].fullName}`,
          draggable: false,
          content: `${data[i].fullName}`,
          isShown:false,
          icon:'./assets/images/marker-red.png'
        }
      );
      this.showHideMarkers();
    }

  }
  ngOnInit() {
    
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();

    });
    this.scheduleVisitFormInit();
    this.getPatientType();
    this.getStates();
    this.getCategories();
    this.getServices();
    this.getLanguages();
    this.getVisitFeq();
    this.getSchedulePref();

    this.dtOptions = {
      searching: false,
      paging: false,
      info:false
    };
  }

  ngOnDestroy(){
    this.commonService.setScope('patient_id' , null);
    this.commonService.setScope('clinician_data' , null);
  }

  scheduleVisitFormInit(){
    this.scheduleVisitForm = this.formBuilder.group({
      name: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z\\.\\-\'\s ]+$'),
        ]
      ],
      dob: ['', Validators.required],
      patientTypeId: [null,
        [
          Validators.required
        ]
      ],
      email: ['',
        [
          // Validators.required,
          Validators.email,
          Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
        ]
      ],
      phone: ['',
        [
          Validators.required,
        ]
      ],
      emergencyContactName: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z\\.\\-\'\s ]+$'),
        ]
      ],
      emergencyContactNo: ['',
        [
          Validators.required,
        ]
      ],
      gender: [this.gender[-1],
        [
          Validators.required
        ]
      ],
      address: ['',
        [
          Validators.required
        ]
      ],
      stateId: [this.states[-1],
        [
          Validators.required
        ]
      ],
      cityId: [this.cities[-1],
        [
          Validators.required
        ]
      ],
      zipcode: [this.zipcodes[-1],
        [
          Validators.required
        ]
      ],
      diagnosis: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z\\.\\-\'\s ]+$'),
        ]
      ],
      insuranceType: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z\\.\\-\'\s ]+$'),
        ]
      ],
      NumberOfVisit:['', Validators.required],
      VisitDate:['', Validators.required],
      IsVisitDateFlexible:[false],
      AuthStartDate:['', Validators.required],
      AuthEndDate:['', Validators.required],
      CPStartDate:['', Validators.required],
      CPEndDate:['', Validators.required],
      DisciplineNeeded:[, Validators.required],
      VisitFrequency:[, Validators.required],
      ServiceType:[, Validators.required],
      SchedulePreference:[, Validators.required],
      GenderPreference:[, Validators.required],
      LanguagePreference:[, Validators.required],
      VisitFees:['',
        [
          Validators.required,
          Validators.pattern('^(?:[1-9][0-9]{0,3}(?:\\.\\d{1,2})?|999|999.00)$')
        ]
      ],
      VisitZipcode:['', [Validators.minLength(5)]],
      AgencyNotes:['', Validators.required],

    });


    this.route.params.subscribe(res => {
      this.type = res ? res['type'] : 0;
      if(res && res['type'] == 2){
        let id = this.commonService.getScope('patient_id');
        this.getPatientDetails(id);
      }else if(res && res['type'] == 1){
        let item = JSON.parse(this.commonService.getScope('clinician_data'));
        item.checked = true;
        this.clinicians_list.push(item);

        setTimeout( () => {
          this.setCurrentLocation(this.clinicians_list);
        },1000);
      }
    });

  }

  getPatientDetails(patient_id){
    this.authService.postRequest('patient/get', {PatientId: patient_id}).then((res) => {
      if( res['status'] ) {
        this.patientdata = res['data'];
        this.patientdata.name = this.patientdata ? this.patientdata.patientName : '';
        this.patientdata.stateId = {id: this.patientdata.stateId, value: this.patientdata.state};
        this.patientdata.cityId = {id: this.patientdata.cityId, value: this.patientdata.city};
        this.patientdata.zipCode = {id: this.patientdata.zipCode, value: this.patientdata.zipCode};
        this.patientdata.VisitZipcode = this.patientdata.zipcode ? this.patientdata.zipcode : '';

        this.getCityList({id: this.patientdata.stateId ? this.patientdata.stateId.id : null});
        this.getZipcodeList({id:this.patientdata.cityId ? this.patientdata.cityId.id : null, value: this.patientdata.city});

        let date = this.patientdata.dob.split('/');
        this.patientdata.dob = {
          year: parseInt(date[2]),
          month: parseInt(date[0]),
          day: parseInt(date[1])
        };
        this.patientdata ? this.scheduleVisitForm.patchValue(this.patientdata) : null;
      }
    });
  }

  onSubmit() {
    this.submitted = true;



    /*this.visitId = '55948DF9-8676-4411-80F0-826148E52B42';
     this.getAllClinicians(this.data);

     return;*/

    const controls = this.scheduleVisitForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
       // console.log(name);
      }
    }
    if(!this.visitId) {
      if (this.scheduleVisitForm.valid) {
        let dates = [];

        if(this.scheduleVisitForm.value.VisitDate.length > 0){
          this.scheduleVisitForm.value.VisitDate.forEach(item => {
            dates.push(this.datePipe.transform(item, 'MM/dd/yyyy'));
          });
        }

        const data = {
          PatientDetails: {
            PatientId: this.patientdata ? this.patientdata.patientId : '',
            PatientTypeId: this.scheduleVisitForm.value.patientTypeId ? this.scheduleVisitForm.value.patientTypeId : '',
            Name: this.scheduleVisitForm.value.name ? this.scheduleVisitForm.value.name : '',
            DOB: this.scheduleVisitForm.value.dob ? this.scheduleVisitForm.value.dob.month + '/' + this.scheduleVisitForm.value.dob.day + '/' + this.scheduleVisitForm.value.dob.year : null,
            Phone: this.scheduleVisitForm.value.phone ? this.scheduleVisitForm.value.phone : '',
            EmergencyContactName: this.scheduleVisitForm.value.emergencyContactName ? this.scheduleVisitForm.value.emergencyContactName : '',
            EmergencyContactNo: this.scheduleVisitForm.value.emergencyContactNo ? this.scheduleVisitForm.value.emergencyContactNo : '',
            Gender: this.scheduleVisitForm.value.gender ? this.scheduleVisitForm.value.gender : '',
            Email: this.scheduleVisitForm.value.email ? this.scheduleVisitForm.value.email : '',
            Address: this.scheduleVisitForm.value.address ? this.scheduleVisitForm.value.address : '',
            CityId: this.scheduleVisitForm.value.cityId ? this.scheduleVisitForm.value.cityId.id : '',
            StateId: this.scheduleVisitForm.value.stateId ? this.scheduleVisitForm.value.stateId.id : '',
            Zipcode: this.scheduleVisitForm.value.zipcode ? this.scheduleVisitForm.value.zipcode : '',
            InsuranceType: this.scheduleVisitForm.value.insuranceType ? this.scheduleVisitForm.value.insuranceType : '',
            Diagnosis: this.scheduleVisitForm.value.diagnosis ? this.scheduleVisitForm.value.diagnosis : '',
            FullAddress: this.scheduleVisitForm.value.address+',' +this.scheduleVisitForm.value.cityId.value+',' +this.scheduleVisitForm.value.stateId.value+',' +this.scheduleVisitForm.value.zipcode
          },
          VisitDetails: {
            AgencyId: this.user ? this.user.profileId : null,
            ClinicianId: this.type == 1 ? this.clinicians_list[0].profileId : '',
            NoOfVisitsNeeded: this.scheduleVisitForm.value.NumberOfVisit ? parseInt(this.scheduleVisitForm.value.NumberOfVisit) : '',
            VisitDate: dates.length > 0 ? dates.join(',') : null,
            AuthorizationStartDate: this.scheduleVisitForm.value.AuthStartDate ? this.scheduleVisitForm.value.AuthStartDate.month + '/' + this.scheduleVisitForm.value.AuthStartDate.day + '/' + this.scheduleVisitForm.value.AuthStartDate.year : null,
            AuthorizationEndDate: this.scheduleVisitForm.value.AuthEndDate ? this.scheduleVisitForm.value.AuthEndDate.month + '/' + this.scheduleVisitForm.value.AuthEndDate.day + '/' + this.scheduleVisitForm.value.AuthEndDate.year : null,
            CertificationPeriodStartDate: this.scheduleVisitForm.value.CPStartDate ? this.scheduleVisitForm.value.CPStartDate.month + '/' + this.scheduleVisitForm.value.CPStartDate.day + '/' + this.scheduleVisitForm.value.CPStartDate.year : null,
            CertificationPeriodEndDate: this.scheduleVisitForm.value.CPEndDate ? this.scheduleVisitForm.value.CPEndDate.month + '/' + this.scheduleVisitForm.value.CPEndDate.day + '/' + this.scheduleVisitForm.value.CPEndDate.year : null,
            DiciplineNeeded: this.scheduleVisitForm.value.DisciplineNeeded ? this.scheduleVisitForm.value.DisciplineNeeded : '',
            VisitFrequency: this.scheduleVisitForm.value.VisitFrequency ? this.scheduleVisitForm.value.VisitFrequency.value : '',
            ServiceTypeId: this.scheduleVisitForm.value.ServiceType ? this.scheduleVisitForm.value.ServiceType : '',
            SchedulePreference: this.scheduleVisitForm.value.SchedulePreference ? this.scheduleVisitForm.value.SchedulePreference.value : '',
            GenderPreference: this.scheduleVisitForm.value.GenderPreference ? this.scheduleVisitForm.value.GenderPreference : '',
            LanguagePreference: this.scheduleVisitForm.value.LanguagePreference ? this.scheduleVisitForm.value.LanguagePreference.toString() : '',
            VisitFees: this.scheduleVisitForm.value.VisitFees ? parseFloat(this.scheduleVisitForm.value.VisitFees) : '',
            VisitZipcode: this.scheduleVisitForm.value.VisitZipcode ? this.scheduleVisitForm.value.VisitZipcode : '',
            AgencyNotes: this.scheduleVisitForm.value.AgencyNotes ? this.scheduleVisitForm.value.AgencyNotes : '',
            IsVisitDateFlexible: this.scheduleVisitForm.value.IsVisitDateFlexible
          }
        }
        // BD27FB92-5CB3-4600-B3AF-F818F9FA5D24
        this.authService.postRequest('visit/add', data).then((res) => {
          if (res['status']) {
            this.visitId = res['data'];
           // this.toaster.success(res['message']);
            if (this.type != 1) {
              let obj = {Start: 0, PageSize: this.pageSize}
              this.getAllClinicians(obj);
            }

            if (this.type == 1) {
              this.router.navigate(['scheduled-visits']);
            }
          }
          if (!res['status']) {
            this.toaster.error(res['message']);
          }
        });
      }
    }else{
      this.getAllClinicians(this.data);
    }
  }

  // minDateCompare(authDate, cerDate){
  //   if(authDate <= cerDate){
  //     this.visitStartDate = authDate;
  //     console.log(this.visitStartDate);
  //   }else if(authDate >= cerDate){
  //     this.visitStartDate = cerDate;
  //     console.log(this.visitStartDate);
  //   }
  // }
  maxDateCompare(authDate, cerDate){
    if(authDate >= cerDate){
      this.visitStartEnd = authDate;
      console.log(this.visitStartEnd);
    }else if(authDate <= cerDate){
      this.visitStartEnd = cerDate;
      console.log(this.visitStartEnd);
    }
  }
  authStartDateSelect(event){
    this.authStartDateNgb = event;
    if( this.authEndDateNgb ){
      if( !event.before(this.authEndDateNgb) && !event.equals(this.authEndDateNgb) ){
        this.scheduleVisitForm.controls.AuthStartDate.setErrors({inValidDate: true});
      }
      if( event.equals(this.authEndDateNgb) || event.before(this.authEndDateNgb) ){
        this.scheduleVisitForm.controls.AuthStartDate.setErrors({inValidDate: false});
        this.scheduleVisitForm.controls.AuthStartDate.updateValueAndValidity();

        this.scheduleVisitForm.controls.AuthEndDate.setErrors({inValidDate: false});
        this.scheduleVisitForm.controls.AuthEndDate.updateValueAndValidity();
      }
    }

    const dob = this.scheduleVisitForm.value.AuthStartDate.year + '-' + this.scheduleVisitForm.value.AuthStartDate.month + '-' + this.scheduleVisitForm.value.AuthStartDate.day;
    this.authStartDate = this.datePipe.transform(dob, 'MM/dd/yyyy');
    this.scheduleVisitForm.controls.VisitDate.reset();
    this.minDate = new Date(this.scheduleVisitForm.value.AuthStartDate.year,this.scheduleVisitForm.value.AuthStartDate.month-1, this.scheduleVisitForm.value.AuthStartDate.day);

    // this.previous_date_auth = this.minDate;
    // if(this.previous_date_auth && this.previous_date_cer){
    //   this.minDateCompare(this.previous_date_auth,this.previous_date_cer);
    // }

  }

  authEndDateSelect(event){
    this.authEndDateNgb = event;

    if( this.authStartDateNgb ){
      if( !event.after(this.authStartDateNgb) && !event.equals(this.authStartDateNgb) ){
        this.scheduleVisitForm.controls.AuthEndDate.setErrors({inValidDate: true});
      }
      if( event.equals(this.authStartDateNgb) || event.after(this.authStartDateNgb) ){
        this.scheduleVisitForm.controls.AuthEndDate.setErrors({inValidDate: false});
        this.scheduleVisitForm.controls.AuthEndDate.updateValueAndValidity();

        this.scheduleVisitForm.controls.AuthStartDate.setErrors({inValidDate: false});
        this.scheduleVisitForm.controls.AuthStartDate.updateValueAndValidity();
      }
    }

    const dob = this.scheduleVisitForm.value.AuthEndDate.year + '-' + this.scheduleVisitForm.value.AuthEndDate.month + '-' + this.scheduleVisitForm.value.AuthEndDate.day;
    this.authEndDate = this.datePipe.transform(dob, 'MM/dd/yyyy');
    this.maxDate = new Date(this.scheduleVisitForm.value.AuthStartDate.year,this.scheduleVisitForm.value.AuthStartDate.month-1, this.scheduleVisitForm.value.AuthStartDate.day);

    this.next_date_auth =  new Date(this.scheduleVisitForm.value.AuthEndDate.year,this.scheduleVisitForm.value.AuthEndDate.month-1, this.scheduleVisitForm.value.AuthEndDate.day);

    if(this.next_date_auth && this.next_date_cer){
      this.maxDateCompare(this.next_date_auth,this.next_date_cer);
    }
  }

  cpStartDateSelect(event){
    this.cpStartDateNgb = event;

    if( this.cpEndDateNgb ){
      if( !event.before(this.cpEndDateNgb) && !event.equals(this.cpEndDateNgb) ){
        this.scheduleVisitForm.controls.CPStartDate.setErrors({inValidDate: true});
      }
      if( event.equals(this.cpEndDateNgb) || event.before(this.cpEndDateNgb) ){
        this.scheduleVisitForm.controls.CPStartDate.setErrors({inValidDate: false});
        this.scheduleVisitForm.controls.CPStartDate.updateValueAndValidity();

        this.scheduleVisitForm.controls.CPEndDate.setErrors({inValidDate: false});
        this.scheduleVisitForm.controls.CPEndDate.updateValueAndValidity();
      }
    }

    const dob = this.scheduleVisitForm.value.CPStartDate.year + '-' + this.scheduleVisitForm.value.CPStartDate.month + '-' + this.scheduleVisitForm.value.CPStartDate.day;
    this.cpStartDate = this.datePipe.transform(dob, 'MM/dd/yyyy');

    // this.previous_date_cer =  new Date(this.scheduleVisitForm.value.CPStartDate.year,this.scheduleVisitForm.value.CPStartDate.month-1, this.scheduleVisitForm.value.CPStartDate.day);;

    // if(this.previous_date_auth && this.previous_date_cer){
    //   this.minDateCompare(this.previous_date_auth,this.previous_date_cer);
    // }
  }

  cpEndDateSelect(event){
    this.cpEndDateNgb = event;

    if( this.cpStartDateNgb ){
      if( !event.after(this.cpStartDateNgb) && !event.equals(this.cpStartDateNgb) ){
        this.scheduleVisitForm.controls.CPEndDate.setErrors({inValidDate: true});
      }
      if( event.equals(this.cpStartDateNgb) || event.after(this.cpStartDateNgb) ){
        this.scheduleVisitForm.controls.CPEndDate.setErrors({inValidDate: false});
        this.scheduleVisitForm.controls.CPEndDate.updateValueAndValidity();

        this.scheduleVisitForm.controls.CPStartDate.setErrors({inValidDate: false});
        this.scheduleVisitForm.controls.CPStartDate.updateValueAndValidity();
      }
    }

    const dob = this.scheduleVisitForm.value.CPEndDate.year + '-' + this.scheduleVisitForm.value.CPEndDate.month + '-' + this.scheduleVisitForm.value.CPEndDate.day;
    this.cpEndDate = this.datePipe.transform(dob, 'MM/dd/yyyy');
    this.scheduleVisitForm.controls.VisitDate.reset();

    this.next_date_cer = new Date(this.scheduleVisitForm.value.CPEndDate.year,this.scheduleVisitForm.value.CPEndDate.month-1, this.scheduleVisitForm.value.CPEndDate.day);

    if(this.next_date_auth && this.next_date_cer){
      this.maxDateCompare(this.next_date_auth,this.next_date_cer);
    }
  }




  getPatientType(){
    this.authService.postRequest('masterlist', {Type: 'PatientType'}).then((res)=>{
      if( res['status'] ) {
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
    this.scheduleVisitForm.patchValue({
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
    this.scheduleVisitForm.patchValue({
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
  getCategories(){
    this.authService.postRequest('masterlist', {Type: 'Category'}).then((res)=>{
      if( res['status'] ){
        this.categories = res['data'];
      }
      if( !res['status'] ){
        this.toaster.error( res['message'] );
      }
    });
  }
  getServices(){
    this.authService.postRequest('masterlist', {Type: 'Servicetype'}).then((res)=>{
      if( res['status'] ){
        this.services = res['data'];
      }
      if( !res['status'] ){
        this.toaster.error( res['message'] );
      }
    });
  }

  getFeeRange(){
    // category/feerange

    if(this.scheduleVisitForm.value.DisciplineNeeded && this.scheduleVisitForm.value.ServiceType) {
      this.authService.postRequest('category/feerange', {
        categoryId: this.scheduleVisitForm.value.DisciplineNeeded,
        serviceTypeId: this.scheduleVisitForm.value.ServiceType
      }).then((res) => {
        if (res['status']) {
          this.feeRange = res['data'];
          this.scheduleVisitForm.controls['VisitFees'].setValidators([Validators.min(res['data'].minValue), Validators.max(res['data'].maxValue)]);
          this.scheduleVisitForm.controls['VisitFees'].updateValueAndValidity();
        }
        if (!res['status']) {
          this.toaster.error(res['message']);
        }
      });
    }
  }

  getLanguages(){
    this.authService.postRequest('masterlist', {Type: 'Language'}).then((res)=>{
      if( res['status'] ){
        this.languages = res['data'];
        this.scheduleVisitForm.patchValue({LanguagePreference: [1]})
      }
      if( !res['status'] ){
        this.toaster.error( res['message'] );
      }
    });
  }

  getSchedulePref(){
    this.authService.postRequest('masterlist', {Type: 'visitfrequency'}).then((res)=>{
      if( res['status'] ){
        this.visitfrequency_list = res['data'];
      }
      if( !res['status'] ){
        this.toaster.error( res['message'] );
      }
    });
  }

  getVisitFeq(){
    this.authService.postRequest('masterlist', {Type: 'schedulepreference'}).then((res)=>{
      if( res['status'] ){
        this.schedulepreference_list = res['data'];
      }
      if( !res['status'] ){
        this.toaster.error( res['message'] );
      }
    });
  }

  clickedMarker(label: string, index: number) {
  }

  radiusDragEnd($event: any) {
    this.radiusLat = $event.coords.lat;
    this.radiusLong = $event.coords.lng;
    this.showHideMarkers();
  }

  event(type,$event) {
    this.radius = $event;
    this.showHideMarkers();
  }

  showHideMarkers(){
    Object.values(this.markers).forEach(value => {
      value.isShown = this.getDistanceBetween(value.lat,value.lng,this.radiusLat,this.radiusLong);
    });
  }

  getDistanceBetween(lat1,long1,lat2,long2){
    var from = new google.maps.LatLng(lat1,long1);
    var to = new google.maps.LatLng(lat2,long2);

    if(google.maps.geometry.spherical.computeDistanceBetween(from,to) <= this.radius){
      return true;
    }else{
      return false;
    }
  }

  selectAllClinicians(){
    this.clinicians_list.forEach(item => {
      item.checked = true;
    })
  }

  sendReq(){
    let checked = this.clinicians_list.filter( item => item.checked);
    //visit/request/add

    if(checked.length > 0){

      let string_ids = Array.prototype.map.call(checked, function(item) { return item.clinicianId; }).join(",");

      this.authService.postRequest('visit/request/add', {VisitId: this.visitId , ClinicianIds : string_ids}).then((res)=>{
        if( res['status'] ){
          this.toaster.success( res['message'] );
          this.router.navigate(['scheduled-visits']);
        }
        if( !res['status'] ){
          this.toaster.error( res['message'] );
        }
      });
    }else{
      this.toaster.error('Please select a clinician to send request');
    }
  }


  changeRadius(type, val){

    if(type == 10)
      this.zoom = 9.5;

    if(type == 5)
      this.zoom =10;

    if(type == 15)
      this.zoom =9.3;

    if(type == 20)
      this.zoom =9.2;



    this.radius = val;
    if(this.scheduleVisitForm.value.VisitZipcode) {
      this.getNearbyLocations();
    }else{
      this.toaster.error('Please provide a zipcode');
    }
  }


  pageChanged(newPage: number) {
    this.data.Start = ( newPage - 1 ) * this.pageSize;
    this.getAllClinicians(this.data);
  }



  getAllClinicians(data, type = 0){
    this.authService.postRequest('clinician/visit/search',
      {
        MaxVisitFees: this.scheduleVisitForm.value.VisitFees ? parseFloat(this.scheduleVisitForm.value.VisitFees) : 0,
        SearchKey: this.data.SearchKey,
        SortCol: this.data.SortCol,
        VisitId: this.visitId,
        Incentives: this.Incentives,
        VisitZipCode: this.scheduleVisitForm.value.VisitZipcode ? this.scheduleVisitForm.value.VisitZipcode : '',
        Start: data.Start,
        PageSize: this.pageSize
      }).then((res1) => {
      if (res1['data']) {
        this.clinicians_list = [];
        this.clinicians_list = res1['data'];
        this.totalDataCount = res1['recordsTotal'];

        if(this.clinicians_list.length == 0 && this.data.type) {
          this.toaster.error('Visit Details and Patient Details do not finds any matched clinician, try again by increasing distance (radius) by clicking above miles button to get zipcodes of nearby locations OR Try changing MaxVisitFees amount for clinician to match')
          this.getNearbyLocations();
        }
        this.setCurrentLocation(this.clinicians_list);
      }
    });
  }


  getNearbyLocations(){
    this.nearby_zipcode = [];
    let promises = []
    let self = this;
    var a = new google.maps.Geocoder();
    if (a) {
      a.geocode({'address': this.scheduleVisitForm.value.VisitZipcode}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK)
          var c = results;
        else
          c = 'No zipcodes';

        if (c) {
          var lat = c[0].geometry.location.lat();
          var lng = c[0].geometry.location.lng();

          var pyrmont = new google.maps.LatLng(lat, lng);

          let map = new google.maps.Map(document.createElement('div'))

          var request = {
            location: pyrmont,
            radius: self.radius,
            types: ['']
          };
          var codes = [];
          var service = new google.maps.places.PlacesService(map);
          service.nearbySearch(request, function (results, status) {
            var x = '';
            if (status == google.maps.places.PlacesServiceStatus.OK) {
              for (var i = 0; i < results.length; i++) {
                var request = {
                  placeId: results[i].place_id,
                  fields: ['name', 'address_component', 'place_id', 'geometry']
                };
                service.getDetails(request, function (place, status1) {
                  if (status1 == google.maps.places.PlacesServiceStatus.OK) {
                    var address = place.address_components;
                    var zipcode = address[address.length - 1].long_name.length >= 5 ?  address[address.length - 1].long_name : address[address.length - 2].long_name;
                    var searchAddressComponents = place.address_components;
                    searchAddressComponents.forEach(val =>{
                      if(val.types[0]=="postal_code"){
                        codes.push(val.short_name);
                      }
                    })
                    x = x + zipcode + ", ";
                    let uniq = [...new Set(codes)];
                    var removeDup = [...new Set(x.split(","))].join(",");
                    self.nearby_zipcode = uniq;
                    self.cdr.detectChanges();

                  }
                });
              }
            }else{
              //console.log('Couldnt\'t find the location');
            }
          });
        }
      });
    }
  }

  filterClinicians(data,type){
    this.data.type = 0;

    if(type == 'name' && (data.target.value.length > 3 || data.target.value.length == 0)) {
      this.data.SearchKey = data.target.value;
      if(this.visitId != '' && this.data.SearchKey != '')
        this.getCliniciansFromList(this.data.SearchKey);
      else{
        this.clinicians_list = [];
        this.totalDataCount = 0;
      }
    }

    if(type == 'sort')
    {
      this.data.SortCol = data.id;
      this.getAllClinicians(this.data);
    }

    this.p =1;
    this.zoom = 10;
  }

  getCliniciansFromList(searchKey){

    let data = {
      UserId: localStorage.getItem('userId'),
      Active : null,
      PatientTypeId: 0,
      Start: 0,
      PageSize: this.pageSize,
      SortCol: "",
      SearchKey: searchKey,
      Gender : "",
      CategoryId : 0,
      LanguageId : 0,
    };

    this.authService.postRequest('clinician/list', data).then((res) => {
      if (res['status']) {
        this.clinicians_list = [];
        this.clinicians_list = res['data'];
        this.totalDataCount = res['recordsTotal'];
      }
      if (res['status'] === false) {
        this.toaster.error(res['message']);
      }
    });
  }

  searchClinicians(){
    this.authService.postRequest('clinician/visit/search',
      {
        MaxVisitFees: this.VisitFees ? parseFloat(this.VisitFees) : 0,
        SearchKey: this.data.SearchKey,
        SortCol: this.data.SortCol,
        VisitId: this.visitId,
        Incentives: this.Incentives,
        VisitZipCode: this.nearby_zipcode ? this.nearby_zipcode.toString() : '',
        Start: 0,
        PageSize: this.pageSize
      }).then((res1) => {
      if (res1['data']) {
        this.clinicians_list = [];
        this.clinicians_list = res1['data'];
        this.totalDataCount = res1['recordsTotal'];

        if(this.clinicians_list.length == 0 && this.data.type) {
          this.toaster.error('No clinicians Found, Please filter your search again.')
          this.getNearbyLocations();
        }
        this.setCurrentLocation(this.clinicians_list);
      }
    });
  }

  setValidity(e){
    if(this.scheduleVisitForm.value.VisitDate){
      if(this.scheduleVisitForm.value.VisitDate.length != parseInt(this.scheduleVisitForm.value.NumberOfVisit))
        this.scheduleVisitForm.controls['VisitDate'].setErrors({'length_check' : true});
      else
        this.scheduleVisitForm.controls['VisitDate'].setErrors(null);
    }
    

  }

  setVisitZipCode(e){
    if(e)
      this.scheduleVisitForm.controls['VisitZipcode'].setValue(e.value);
  }
}
