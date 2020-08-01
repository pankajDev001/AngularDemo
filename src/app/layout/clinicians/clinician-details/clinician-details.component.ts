import {Component, OnInit, Renderer} from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { Title } from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../../environments/environment';
import {VisitDetailsComponent} from '../../../modals/visit-details/visit-details.component';
import {NgbModal, NgbModalOptions, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {EditClinicianComponent} from '../../../modals/edit-clinician/edit-clinician.component';
import {CommonService} from '../../../services/common.service';
import {RatingsReviewComponent} from '../../../modals/ratings-review/ratings-review.component';
import Swal from "sweetalert2";

@Component({
  selector: 'app-clinician-details',
  templateUrl: './clinician-details.component.html',
  styleUrls: ['./clinician-details.component.scss'],
  animations: [routerTransition()]
})
export class ClinicianDetailsComponent implements OnInit {
  classApplied = false;
  user = JSON.parse(localStorage.getItem('user'));
  dtOptions: any = {};
  contentUrl = environment.host_url;
  clinicianId: any;
  clinicianData: any;
  listener: any;
  visitIdListener: any;
  modalRef: NgbModalRef;
  scheduledVisits = [{id: 'ALL', value: 'ALL'}];
  isEditPermission:any= false;
  isDeletePermission:any = false;
  constructor(
    private titleSerivce: Title,
    private router: ActivatedRoute,
    private route: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private renderer: Renderer,
    private commonService: CommonService

  ) {

    this.getVisitStatus();
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
      columnDefs: [
        { responsivePriority: 1, targets: 5 }
      ],
      ajax: {
        url: environment.api_url + 'visit/list',
        type: 'POST',
        'beforeSend': function (request) {
          var token = 'Bearer ' + localStorage.getItem('token');
          request.setRequestHeader('Authorization', token);
        },
        data: function(data){
          data['Active'] = true;
          data['Status'] = self.clinicianData ? self.clinicianData.clinician.Status: true;
          data['ClinicianId'] = self.clinicianData ? self.clinicianData.clinician.clinicianId : '';
        },
        error:function (res) {
          if(res.status == 401)
            self.toastr.error('Unauthorized','Error!');
        },
        dataSrc: function (data) {
          return data['data'];
        },
      },
      columns: [
        {
          data: "patientName",
          title: "Patient Name",
          render: function (data, type, row, meta) { return data ? data : '-' }
        },
        {
          data: "agencyName",
          title: "Agency Name",
          render: function (data, type, row, meta) { return data ? data : '-' }
        },

        {
          data: "category",
          title: "Category",
          render: function (data, type, row, meta) { return data ? data : '-' }
        },
        {
          data: "serviceTypeName",
          title: "Service",
          render: function (data, type, row, meta) { return data ? data : '-' }
        },
        {
          data: "visitStatus",
          title: "Status",
          render: function (data, type, row, meta) {
            var completed = '<span class="badge badge-success badge-pill">Completed</span>';
            var Assigned = '<span class="badge badge-caret badge-pill">Assigned</span>';
            var rescheduled = '<span class="badge badge-rescheduled badge-pill">Rescheduled</span>';
            var cancelled = '<span class="badge badge-danger badge-pill">Cancelled</span>';
            var serviceProvided = '<span class="badge badge-info badge-pill">Service Provided</span>';
            var pending = '<span class="badge badge-secondary badge-pill">Pending</span>';
            var inProgress = '<span class="badge badge-warning badge-pill">In-Progress</span>';

            switch(data) {
              case "ASSIGNED": {
                return Assigned;
                break;
              }
              case "COMPLETED": {
                return completed;
                break;
              }
              case "RESCHEDULED": {
                return rescheduled;
                break;
              }
              case "CANCELLED": {
                return cancelled;
                break;
              }
              case "SERVICE-PROVIDED": {
                return serviceProvided;
                break;
              }
              case "PENDING": {
                return pending;
                break;
              }
              case "IN-PROGRESS": {
                return inProgress;
                break;
              }
              default: {
                return '-';
                break;
              }
            }
          }
        },
        {
          data: "visitId",
          title: "Details",
          render: function (data, type, row, meta) {
            var details = `<div class="actions-wrapper">
              <div class="tooltipWrapper">
                <div class="icon-wrapper" scheduled-visit-details-button="`+data+`">
                  <i class="fa fa-eye" scheduled-visit-details-button="`+data+`"></i>
                </div>
                <div class="tooltip bs-tooltip-top dtTooltip">
                  <div class="arrow"></div>
                  <div class="tooltip-inner">View</div>
                </div>
              </div>
            </div>`;
            return data ? details : '-';
          }
        }
      ]
    };

  }

  ngOnInit() {
    let self = this;
    $(window).click(function() {
      self.classApplied = false;
    });
    $('.page-header-filter').click(function(e){
      e.stopPropagation();
    });

    this.titleSerivce.setTitle('HomeHealthPro | Clinician Details')

    this.router.params.subscribe( params => {
      if(params)
        this.getClinicianDetails(params);
    });

    this.commonService.getPermission('/clinicians/edit').then(res => {
      this.isEditPermission = res;
      this.commonService.getPermission('/clinicians/delete').then(res1 => {
        this.isDeletePermission = res1;
      });
    });
  }

  ngAfterViewInit(): void {
    this.listener = this.renderer.listenGlobal('document', 'click', (event) => {
      if (event.target.hasAttribute("scheduled-visit-details-button")) {
        this.visitIdListener = event.target.getAttribute("scheduled-visit-details-button");
        this.openDetailModal(this.visitIdListener);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.listener) {
      this.listener();
    }
  }

  onFilterToggle(e){
    e.stopPropagation();
    this.classApplied = !this.classApplied;
  }

  getClinicianDetails(data){
    this.clinicianId = data.id;
    this.authService.postRequest('clinician/get', {UserId:this.clinicianId}).then((res) => {
      if (res['status']) {

        this.clinicianData = res['data'];
        var table = $('#clinician-scheduled-visits').DataTable();
        table.ajax.reload();

      }
      if (res['status'] === false) {
        this.toastr.error(res['message']);
      }
    });
  }

  changeStatus(event) {
    var statusData = { UserId: this.clinicianData.clinician.userId, Active: event.target.checked };
    this.authService.updateRequest('user/activestatus/update', statusData).then((res) => {
      if (res['status']) {
        this.toastr.success(res['message']);
      } else {
        this.toastr.error(res['message']);
      }
    });
  }

  openDetailModal(visitId){
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      ariaLabelledBy: 'visit-details',
      centered: true,
      size: 'lg'
    };
    this.modalRef = this.modalService.open(VisitDetailsComponent, ngbModalOptions);
    this.modalRef.componentInstance.visitId = visitId;
  }

  onChangePatientVisit(event) {
    var status = (event.id) ? event.id : null;
    if (status == 'ALL') {
      this.clinicianData.clinician.Status = '';
    } else {
      this.clinicianData.clinician.Status = status;
    }
    var table = $('#clinician-scheduled-visits').DataTable();
    table.ajax.reload();
  }

  getVisitStatus() {
    this.authService.postRequest('masterlist', { Type: 'VISITSTATUS' }).then((res) => {
      if (res['status']) {
        this.scheduledVisits = [ ...this.scheduledVisits, ...res['data'] ];

      } else {
        this.toastr.error("Something went wrong!");
      }
    }).catch(error => {
      this.toastr.error("Something went wrong!");
    });
  }

  editClinician(data) {
    // return;
    this.modalRef = this.modalService.open(EditClinicianComponent, { ariaLabelledBy: 'edit-clinician', centered: true, size: 'lg' , backdrop : 'static', keyboard : false});
    this.modalRef.componentInstance.clinicianData = data;
    this.modalRef.componentInstance.updateCliniciansList.subscribe(()=>{
      this.getClinicianDetails({id:this.clinicianId});
    });
  }


  onRate(e,clinician){
    this.modalRef = this.modalService.open(RatingsReviewComponent, { ariaLabelledBy: 'rating-review-modal', centered: true, size: 'lg' })
    clinician.review_type = 'ATC';
    clinician.profile_id = clinician.clinicianId;
    this.modalRef.componentInstance.clinicianData = clinician;

  }

  deleteClinician() {

    this.commonService.getPermission('/clinicians/delete').then(res => {

      if (res) {
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.value) {
            this.authService.deleteRequest('clinician/delete', {UserId: this.clinicianData.clinician.userId, ActionType: "DELT"}).then((res) => {
              if (res['status']) {
                Swal.fire({
                  titleText: 'Deleted',
                  text: res['message'],
                  icon: 'success',
                  timer: 2000,
                  animation: true,
                  showConfirmButton: false
                });

                this.route.navigate(['clinicians']);
              }
              if (res['status'] === false) {
                this.toastr.error(res['message']);
              }
            });
          }
        });
      } else {
        this.toastr.error("No permission");

      }
    });
  }
}
