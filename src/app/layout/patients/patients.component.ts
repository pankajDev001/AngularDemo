import { Component, OnInit, Renderer, Output, EventEmitter } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { PatientDetailsComponent } from '../../modals/patient-details/patient-details.component';
import { CreatePatientComponent } from '../../modals/create-patient/create-patient.component';
import { Router } from '@angular/router';
import {CommonService} from '../../services/common.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss'],
  animations: [routerTransition()],
  entryComponents: [CreatePatientComponent]
})
export class PatientsComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('user'));
  dtOptions: any = {};
  modalRef: NgbModalRef;
  listener: any;
  patientIdListener: any;
  data: any = {
    Status: ""
  }

  @Output() patientId = new EventEmitter();

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    public router: Router,
    private titleService: Title,
    private renderer: Renderer,
    private modalService: NgbModal,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.titleService.setTitle('HomeHealthPro | Patients Listing');
    this.dataTable();
  }

  ngOnDestroy(): void {
    if (this.listener) {
      this.listener();
    }
  }

  ngAfterViewInit(): void {
    this.listener = this.renderer.listenGlobal('document', 'click', (event) => {
      // Details Listener
      if (event.target.hasAttribute("patient-details-button")) {
        this.patientIdListener = event.target.getAttribute("patient-details-button");
        this.openDetailModal(this.patientIdListener);
      }

      if( event.target.hasAttribute("schedule-visit-button") ){

        let id = event.target.getAttribute('schedule-visit-button');
        this.commonService.setScope('patient_id', id);
        this.router.navigate(['/scheduled-visits/add/2']);
      }
    });
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
      order: [],
      ajax: {
        url: environment.api_url + 'patient/list',
        type: 'POST',
        'beforeSend': function (request) {
          var token = 'Bearer ' + localStorage.getItem('token');
          request.setRequestHeader('Authorization', token);
        },
        error:function (res) {},
        dataSrc: function (data) {
          return data['data'];
        },
      },
      initComplete: function() {

        $('#patients-listing_filter input').unbind();
        $('#patients-listing_filter input').bind('keyup', function(e) {
          var table = $('#patients-listing').DataTable();
          var val = $('#patients-listing_filter input').val();
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
          data: "gender",
          title: "Gender",
          render: function (data, type, row, meta) { return data ? data : '-' }
        },
        {
          data: "dob",
          title: "DOB",
          render: function (data, type, row, meta) { return data ? data : '-' }
        },
        {
          data: "patientType",
          title: "Type",
          render: function (data, type, row, meta) { return data ? data : '-' }
        },
        {
          data: "email",
          title: "Email",
          render: function (data, type, row, meta) { return data ? data.toLowerCase() : '' }
        },
        {
          data: "phone",
          title: "Phone",
          orderable: false,
          render: function (data, type, row, meta) { return data ? data : '-' }
        },
        {
          data: "patientId",
          title: "Details",
          orderable: false,
          render: function (data, type, row, meta) {
            var details = `<div class="actions-wrapper">
              <div class="tooltipWrapper">
                <div class="icon-wrapper" patient-details-button="`+data+`">
                  <i class="fa fa-eye" patient-details-button="`+data+`"></i>
                </div>
                <div class="tooltip bs-tooltip-top dtTooltip">
                  <div class="arrow"></div>
                  <div class="tooltip-inner">View</div>
                </div>
              </div>
            </div>`;
            return data ? details : '-';
          }
        },
        {
          data: "patientId",
          title: "Schedule Visit",
          orderable: false,
          visible: this.user.role === 'AGENCY',
          render: function (data, type, row, meta) {
            var visit = '<a href="javascript:;" class="btn btn-outline-primary btn-sm btn-radius" schedule-visit-button="'+data+'">Schedule Visit</a>';
            return data ? visit : '-';
          }
        }
      ]
    }
  }

  openDetailModal(patientId){
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      ariaLabelledBy: 'patient-details',
      centered: true,
      size: 'lg'
    };
    this.modalRef = this.modalService.open(PatientDetailsComponent, ngbModalOptions);
    this.modalRef.componentInstance.patientId = patientId;
  }

  addPatientModal(){
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      ariaLabelledBy: 'create-patient',
      centered: true,
      size: 'lg'
    };
    this.modalRef = this.modalService.open(CreatePatientComponent, ngbModalOptions);
    this.modalRef.componentInstance.updatePatientList.subscribe(() => {
      var table = $('#patients-listing').DataTable();
      table.ajax.reload();
    });
  }
}
