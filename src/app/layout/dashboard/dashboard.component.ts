import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NgbDate, NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [routerTransition()],
})

export class DashboardComponent implements OnInit {
  user = localStorage.getItem('user');

  @ViewChildren(DataTableDirective)
  dtElements: QueryList<any>;
  dtOptions: DataTables.Settings = {};
  agencydtTrigger = new Subject();
  cliniciandtTrigger = new Subject();
  scheduledtTrigger = new Subject();

  classApplied = false;
  contentUrl = environment.host_url;

  dashboardData: any = {};
  dashboardCard: [];
  recentlyScheduledVisit: any =  [];
  recentlyAddedClinician: any = [];
  recentlyAddedAgency: any = [];
  filterForm: FormGroup;

  agencies: any = [];
  clinicians: any = [];

  maxDate = undefined;
  fromDate: NgbDate;
  newFromDate: null;
  toDate: NgbDate;
  newToDate: null;
  getDate = new Date();
  day = this.getDate.getDate()
  month = this.getDate.getMonth() + 1
  year = this.getDate.getFullYear()
  today = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day:new Date().getDate()};
  public result: any;
  readonly DELIMITER = '/';

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dateConfig: NgbDatepickerConfig,
    public formatter: NgbDateParserFormatter,
    private titleSerice: Title,
  ) {

    // Disable Future Dates
    const currentDate = new Date();
    this.maxDate = {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      day: currentDate.getDate()
    };
    //this.dateConfig.maxDate = { year: this.maxDate.year, month: this.maxDate.month, day: this.maxDate.day };
    this.dateConfig.outsideDays = 'hidden';
  }

  ngOnInit() {
    this.titleSerice.setTitle('HomeHealthPro | Dashboard');

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
    }

    this.filterForm = this.formBuilder.group({
      Agencies: [],
      Clinicians: [],
      FromDate: [],
      ToDate: []
    });

    this.getDashboardDetails();
    this.getAgenciesList();
    this.getCliniciansList();
  }

  onFilterToggle(e){
    e.stopPropagation();
    this.classApplied = !this.classApplied;
  }

  getDashboardDetails() {
    const data = {
      AgencyId: this.filterForm.value.Agencies ? this.filterForm.value.Agencies : '',
      ClinicianId: this.filterForm.value.Clinicians ? this.filterForm.value.Clinicians : '',
      FromDate: this.newFromDate ? this.newFromDate : '',
      ToDate: this.newToDate ? this.newToDate : ''
    }

    this.authService.postRequest('admin/dashboard', data).then((res) => {
      if (res['status']) {
        this.dashboardData = res['data'];
        this.dashboardCard = this.dashboardData.dashboardTotalCounterCards;

        this.recentlyAddedAgency = this.dashboardData.recentlyAddedAgency;
        this.recentlyAddedClinician = this.dashboardData.recentlyAddedClinician;
        this.recentlyScheduledVisit = this.dashboardData.recentlyScheduledVisit;

        this.dtElements.forEach((dtElement: DataTableDirective, index: number) => {
          dtElement.dtInstance.then((dtInstance: any) => {
            dtInstance.destroy();
          });
          dtElement.dtTrigger.next();
        });
      }
      if (res['status'] === false) {
        this.toastr.error(res['message']);
      }
    });
  }

  getAgenciesList() {
    const data = {
      Active: null,
      pageSize: -1
    }
    this.authService.postRequest('agency/list', data).then((res) => {
      if (res['status']) {
        this.agencies = res['data'];
      }
      if (res['status'] === false) {
        this.toastr.error(res['message']);
      }
    });
  }

  getCliniciansList() {
    const data = {
      Active: null,
      pageSize: -1
    }
    this.authService.postRequest('clinician/list', data).then((res) => {
      if (res['status']) {
        this.clinicians = res['data'];
      }
      if (res['status'] === false) {
        this.toastr.error(res['message']);
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
    this.newFromDate = null;
    this.newToDate = null;
    this.getDashboardDetails();
  }

  ngAfterViewInit(): void {
    this.agencydtTrigger.next();
    this.cliniciandtTrigger.next();
    this.scheduledtTrigger.next();
  }
}
