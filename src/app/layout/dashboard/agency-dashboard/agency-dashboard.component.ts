import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { routerTransition } from 'src/app/router.animations';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbDate, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { DataTableDirective } from 'angular-datatables';
import {CommonService} from "../../../services/common.service";

@Component({
  selector: 'app-agency-dashboard',
  templateUrl: './agency-dashboard.component.html',
  styleUrls: ['./agency-dashboard.component.scss'],
  animations: [routerTransition()]
})
export class AgencyDashboardComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('user'));

  @ViewChildren(DataTableDirective)
  dtElements: QueryList<any>;
  dtOptions: DataTables.Settings = {};
  dtTrigger = new Subject();
  scheduledtTrigger = new Subject();

  dashboardData: any = {};
  dashboardCard: any = [];
  filterForm: FormGroup;
  clinicians = [];
  classApplied: boolean = false;
  maxDate = undefined;
  fromDate: NgbDate;
  newFromDate: string;
  toDate: NgbDate;
  newToDate: string;
  result: any;
  newFormatedDate: any;
  readonly DELIMITER = '/';
  getDate = new Date();
  day = this.getDate.getDate()
  month = this.getDate.getMonth() + 1
  year = this.getDate.getFullYear()
  today = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day:new Date().getDate()};
  constructor(
    private title: Title,
    private authService: AuthService,
    private commonService: CommonService,
    private toaster: ToastrService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dateConfig: NgbDatepickerConfig,
  ) {}

  ngOnInit() {
    this.title.setTitle('HomeHealthPro | Agency Dashboard');

    let self = this;
    $(window).click(function() {
      self.classApplied = false;
    });
    $('.page-header-filter').click(function(e){
      e.stopPropagation();
    });

    this.dtOptions = {
      paging: false,
      ordering: false,
      info: false,
      responsive: true
    };

    this.filterForm = this.formBuilder.group({
      Clinicians: [],
      FromDate: [],
      ToDate: []
    });

    // Disable Future Dates
    const currentDate = new Date();
    // this.maxDate = {
    //   year: currentDate.getFullYear(),
    //   month: currentDate.getMonth() + 1,
    //   day: currentDate.getDate()
    // };
    //this.dateConfig.maxDate = { year: this.maxDate.year, month: this.maxDate.month, day: this.maxDate.day };
    this.dateConfig.outsideDays = 'hidden';

    this.authService.postRequest('clinician/list', {Active : null, pageSize: -1}).then((res)=>{
      if( res['status'] ){
        this.clinicians = res['data'];
        this.getDashboardDetails();
      }
      if( !res['status'] ){
        this.toaster.error( res['message'] );
      }
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  getDashboardDetails(){
    const data = {
      ClinicianId: this.filterForm.value.Clinicians ? this.filterForm.value.Clinicians : '',
      FromDate: this.newFromDate ? this.newFromDate : '',
      ToDate: this.newToDate ? this.newToDate : ''
    }
    this.authService.postRequest('agency/dashboard', data).then((res)=>{
      if( res['status'] ){
        this.dashboardData = res['data'];
        localStorage.setItem('notificationCount',this.dashboardData.notificationCount);
        this.commonService.emitNavChangeEvent(this.dashboardData.notificationCount);
        this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
          dtElement.dtInstance.then((dtInstance: any) => {
            dtInstance.destroy();
          });
          dtElement.dtTrigger.next();
        });
      }
      if( !res['status'] ){
        this.toaster.error( res['message'] )
      }
    });
  }

  format(date) {
    if (date) {
      const dob = date.month + this.DELIMITER + date.day + this.DELIMITER + date.year;
      this.result = this.datePipe.transform(dob, 'MM/dd/yyyy');
    }
    return this.result;
  }

  onFilterToggle(e){
    e.stopPropagation();
    this.classApplied = !this.classApplied;
  }

  onFromDateSelection(date) {
    this.format(date)
    this.newFromDate = this.result;
    this.fromDate = date;
  }

  onToDateSelection(date) {
    this.format(date)
    this.newToDate = this.result;
    this.toDate = date;
  }

  onSubmit() {
    this.getDashboardDetails();
    this.classApplied = false;
  }

  resetFilterForm() {
    this.filterForm.reset();
    this.newFromDate = "";
    this.newToDate = "";
    this.getDashboardDetails();
    this.classApplied = false;
  }

  ngAfterViewInit(): void {
    this.scheduledtTrigger.next();
  }
}
