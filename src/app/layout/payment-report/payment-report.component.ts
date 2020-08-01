import { Component, OnInit } from '@angular/core';
import { routerTransition } from 'src/app/router.animations';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NgbDate, NgbCalendar, NgbDatepickerConfig, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-payment-report',
  templateUrl: './payment-report.component.html',
  styleUrls: ['./payment-report.component.scss'],
  animations: [routerTransition()]
})
export class PaymentReportComponent implements OnInit {
  classApplied = false;
  // Filter Form
  filterForm: FormGroup;
  agencies: any = [];
  clinicians: any = [];
  maxDate = undefined;
  fromDate: NgbDate;
  newFromDate: null;
  toDate: NgbDate;
  newToDate: null;
  public result: any;
  readonly DELIMITER = '/';
  user = JSON.parse(localStorage.getItem('user'));

  dtOptions: any = {};
  dtTrigger = new Subject();
  scrollbarOptions: any = {};
  // var dtSearch = $('.dataTables_filter input').val();
  data: any = {
      AgencyId: '',
      ClinicianId: '',
      FromDate: '',
      ToDate: '',
      Search: '',
      DownloadType: ''
  };
  paymentCard:any = [];
  tableResponseData:any[]=[];


  constructor(
    private titleService: Title,
    private authService: AuthService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private dateConfig: NgbDatepickerConfig,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
  ) {

    // Disable Future Dates
    const currentDate = new Date();
    this.maxDate = {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      day: currentDate.getDate()
    };
    this.dateConfig.maxDate = { year: this.maxDate.year, month: this.maxDate.month, day: this.maxDate.day };
    this.dateConfig.outsideDays = 'hidden';
  }

  ngOnInit() {
    let self = this;
    $(window).click(function() {
      self.classApplied = false;
    });
    $('.page-header-filter').click(function(e){
      e.stopPropagation();
    });

    this.titleService.setTitle('HomeHealthPro | Payment Report');

    this.dtOptions = {
      paging: true,
      ordering: true,
      info: true,
      responsive: true,
      search: true
    };

    this.scrollbarOptions = {
      axis: 'x',
      theme: 'healthPro-scrollbar',
    };

    this.filterForm = this.formBuilder.group({
      Agencies: [],
      Clinicians: [],
      FromDate: [],
      ToDate: []
    });
    this.getAgenciesList();
    this.getCliniciansList();
    this.dataTable();
  }

  onFilterToggle(e){
    e.stopPropagation();
    this.classApplied = !this.classApplied;
  }


  getAgenciesList() {
    const data = {
      Active : null,
      PageSize:-1
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
      Active : null,
      PageSize:-1
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
    this.data.AgencyId = this.filterForm.value.Agencies;
    this.data.ClinicianId = this.filterForm.value.Clinicians;
    this.data.FromDate = this.newFromDate;
    this.data.ToDate = this.newToDate;
    var table = $('#payment-report-table').DataTable();
    table.ajax.reload();
    this.classApplied = false;
  }

  resetFilterForm() {
    this.filterForm.reset();
    this.newFromDate = null;
    this.newToDate = null;

    this.data.AgencyId = '';
    this.data.ClinicianId = '';
    this.data.FromDate = '';
    this.data.ToDate = '';
    this.data.Search = '';
    var table = $('#payment-report-table').DataTable();
    table.ajax.reload();
  }

  dataTable(){
    let self = this;
    this.dtOptions = {
      processing: true,
      serverSide: true,
      pagingType: 'simple_numbers',
      pageLength: 10,
      language: {
        processing: '<div class="loader-wrapper"><span>Wait Data is loading... </span>&nbsp;&nbsp; <span class="loader" ></span></div>',
        paginate: {
          next: 'Next <i class="fa fa-angle-double-right ml-1"></i>',
          previous: '<i class="fa fa-angle-double-left mr-1"></i> Previous'
          }
      },
      responsive: true,
      order: [0, 'asc'],
      ajax: {
        url: environment.api_url + 'payment/list',
        type: 'POST',
        'beforeSend': function (request) {
          var token = 'Bearer ' + localStorage.getItem('token');
          request.setRequestHeader('Authorization', token);
        },
        data: function(data){
          data['AgencyId'] = self.user.role == 'AGENCY' ? self.user.profileId : self.data.AgencyId;
          data['ClinicianId'] = self.data.ClinicianId;
          data['FromDate'] = self.data.FromDate;
          data['ToDate'] = self.data.ToDate;
          data['DownloadType'] = self.data.DownloadType;
          data['search'].value = $('.dataTables_filter input').val();
        },
        error:function (res) {
        },
        dataSrc: function (data) {
          self.paymentCard=data.paymentCounts;
          self.tableResponseData=data.data;
          return data.data;
        }
      },
      initComplete: function() {

        $('#payment-report-table_filter input').unbind();
        $('#payment-report-table_filter input').bind('keyup', function(e) {
          var table = $('#payment-report-table').DataTable();
          var val = $('#payment-report-table_filter input').val();
          if(String(val).length > 3 || String(val).length == 0) {
            table.search(String(val)).draw();
          }
        });
      },
      columns: [
        {
          data: "patientName",
          title: "Patient Name",
          render: function (data, type, row, meta) { return data ? data : '-' }
        },
        {
          data: "visitDate",
          title: "Visit Date",
          render: function (data, type, row, meta) { return data ? data : '-' }
        },
        {
          data: "agencyName",
          title: "Agency Name",
          render: function (data, type, row, meta) { return data ? data : '-' }
        },
        {
          data: "clinicianName",
          title: "Clinician Name",
          render: function (data, type, row, meta) { return data ? data : '-' }
        },
        {
          data: "status",
          title: "Status",
          className: "",
          render: function (data, type, row, meta) {
            var approved = '<span class="badge badge-success badge-pill">Approved</span>';
            switch(data){
              case "APPROVED":{
                return approved
                break;
              }
              default: {
                return '-'
                break;
              }
            }
           }
        },
        {
          data: "apf",
          title: "APF",
          className: 'text-center',
          render: function (data, type, row, meta) { return data ? '$'+data : '-' }
        },
        {
          data: "cpf",
          title: "CPF",
          className: 'text-center',
          visible:self.user.role != 'AGENCY',
          render: function (data, type, row, meta) { return data ? '$'+data : '-' }
        },
        {
          data: "clinicianFee",
          title: "Clinician Fees",
          className: 'text-center',
          visible:self.user.role != 'AGENCY',
          render: function (data, type, row, meta) { return data ? '$'+data : '-' }
        },
        {
          data: "totalAmount",
          title: "Total Amount",
          className: 'text-center',
          render: function (data, type, row, meta) {
            var totalAmount = '<span class="text-success">$'+data+'</span>'
            return data ? totalAmount : '-';
          }
        }
      ],
      dom:"Blfrtip",
      buttons: [
        {
          text: '<i class="fa fa-file-text-o"></i>',
          className: 'btn btn-primary btn-sm',
          titleAttr: 'Download report as CSV',
          action: function () {
            self.donwloadFileRequest('csv');
          }
        },
        {
          text: '<i class="fa fa-file-excel-o"></i>',
          className: 'btn btn-success btn-sm',
          titleAttr: 'Download report as Excel sheet',
          action: function () {
            self.donwloadFileRequest('excel');
          }
        },
        {
          text: '<i class="fa fa-file-pdf-o"></i>',
          className: 'btn btn-danger btn-sm',
          titleAttr: 'Download report as PDF',
          action: function () {
            self.donwloadFileRequest('pdf');
          }
        }

      ]
    }
  }

  donwloadFileRequest(fileType){
    if(this.tableResponseData && this.tableResponseData.length>0){
    let search = $('.dataTables_filter input').val();
    let agencyId = this.filterForm.value.Agencies?this.filterForm.value.Agencies:'';
    let clinicianId = this.filterForm.value.Clinicians?this.filterForm.value.Clinicians:'';
    let fromDate = this.newFromDate?this.newFromDate:'';
    let toDate = this.newToDate?this.newToDate:'';
    let body='DownloadType='+fileType+'&AgencyId='+agencyId+'&ClinicianId='+clinicianId+'&FromDate='+fromDate+'&ToDate='+toDate+'&search[value]='+search;

      this.authService.postRequestFile('payment/export', body)
        .then((response)=>{
          this.downloadFile(response,fileType);
        });
      }
      else{
        this.toastr.error('No data found to export.');
      }
  }

  downloadFile(data: any, fileType: string) {
    let typeToDownload='application/octet-stream';
    let fileName:string='PaymentReport_'+new Date().toString();
    if(fileType==='csv'){
      typeToDownload='application/octet-stream';
       fileName=fileName+'.csv';
    }else if(fileType==='pdf'){
      typeToDownload='application/pdf';
      fileName=fileName+'.pdf';
    }else if(fileType==='excel'){
      typeToDownload='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      fileName=fileName+'.xlsx';
    }

    const blob = new Blob([data], { type: typeToDownload });
    var binaryData = [];
    binaryData.push(blob);

    const url = window.URL.createObjectURL(new Blob(binaryData, { type: typeToDownload })); // <-- work with blob directly

     // create hidden dom element (so it works in all browsers)
     const a = document.createElement('a');
     a.setAttribute('style', 'display:none;');
     document.body.appendChild(a);

     // create file, attach to hidden element and open hidden element
     a.href = url;
     a.download = fileName;
     a.click();
  }
}
