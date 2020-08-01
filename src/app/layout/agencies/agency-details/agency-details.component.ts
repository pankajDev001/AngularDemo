import {Component, OnInit, Renderer} from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from '../../../services/auth.service';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { EditAgencyComponent } from '../../../modals/edit-agency/edit-agency.component';
import {NgbModal, NgbModalOptions, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {VisitDetailsComponent} from '../../../modals/visit-details/visit-details.component';
import {RatingsReviewComponent} from '../../../modals/ratings-review/ratings-review.component';

@Component({
  selector: 'app-agency-details',
  templateUrl: './agency-details.component.html',
  styleUrls: ['./agency-details.component.scss'],
  animations: [routerTransition()],
  entryComponents: [EditAgencyComponent]
})
export class AgencyDetailsComponent implements OnInit {
  classApplied = false;
  userId: number;
  agencyDetail: any ;
  contentUrl = environment.host_url;
  agencyRevenue: number;
  dtOptions: any;
  agencyId;
  agencyDocuments = [];
  scheduledVisits = [{id: 'ALL', value: 'ALL'}];
  listener: any;
  visitIdListener: any;
  agencyVisitData: any = {
    Active: true,
    Status: ''
  };
  modalRef: NgbModalRef;
  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private renderer: Renderer,
              private titleService: Title,
              private toastr: ToastrService,
              private router: Router,
              private modalService: NgbModal) { }

  ngOnInit() {
    let self = this;
    $(window).click(function() {
      self.classApplied = false;
    });
    $('.page-header-filter').click(function(e){
      e.stopPropagation();
    });
    this.titleService.setTitle('HomeHealthPro | Agency Details');
    this.route.params.subscribe(params => {
      this.userId = (params.id) ? params.id : "";
    });
    this.agencyId = localStorage.getItem('agencyId');
    this.getAgencyDetails();
    this.agencyVisitData.AgencyId = this.agencyId;
    this.dataTable();
    this.getVisitStatus();
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

  dataTable() {
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
        data: function (data) {
          data['Status'] = self.agencyVisitData.Status;
          data['Active'] = self.agencyVisitData.Active;
          data['AgencyId'] = self.agencyVisitData.AgencyId;
          return data;
        },
        'beforeSend': function (request) {
          var token = 'Bearer ' + localStorage.getItem('token');
          request.setRequestHeader('Authorization', token);
        },
        error: function (res) {
          if (res.status == 401) { }
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
          data: "clinicianName",
          title: "Clinician Name",
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
            var created = '<span class="badge badge-secondary badge-pill">Assigned</span>';
            var rescheduled = '<span class="badge badge-info badge-pill">Rescheduled</span>';
            var cancelled = '<span class="badge badge-danger badge-pill">Cancelled</span>';
            var serviceProvided = '<span class="badge badge-service-provided badge-pill">Service Provided</span>';
            var inProgress = '<span class="badge badge-dark badge-pill">In Progress</span>';
            var pending = '<span class="badge badge-warning badge-pill">Pending</span>';

            switch(data) {
              case "ASSIGNED": {
                return created;
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
              case "IN-PROGRESS": {
                return inProgress;
                break;
              }
              case "PENDING": {
                return pending;
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
      ],
    };
  }
  onFilterToggle(e){
    e.stopPropagation();
    this.classApplied = !this.classApplied;
  }
  getAgencyDetails() {
    this.authService.postRequest('agency/get', { UserId: this.userId }).then((res) => {
      if (res['status']) {
        this.agencyDetail = res['data']['agency'] ? res['data']['agency'] : null;
        this.agencyRevenue = res['data']['agencyRevenue']['totalRevenueEarned'];
        this.agencyDocuments = res['data']['agencyFiles'];

      }
    }).catch(error => {
      this.toastr.error("Something went wrong!");
      this.router.navigate(['/agencies']);
    });
  }


  changeStatus(event) {
    var statusData = { UserId: this.userId, Active: event.target.checked };
    this.authService.updateRequest('user/activestatus/update', statusData).then((res) => {
      if (res['status']) {
        this.toastr.success(res['message']);
      } else {
        this.toastr.error(res['message']);
      }
    });
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

  onChangePatientVisit(event) {
    var status = (event.id) ? event.id : null;
    if (status == 'ALL') {
      this.agencyVisitData.Status = '';
    } else {
      this.agencyVisitData.Status = status;
    }
    var table = $('#patients-listing').DataTable();
    table.ajax.reload();
  }

  deleteAgency(userId) {
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
        let agencyData = { UserId: userId, ActionType: 'DELT' };
        this.authService.deleteRequest('agency/delete', agencyData).then((res) => {
          if (res['status']) {
            Swal.fire({
              titleText: 'Deleted',
              text: res['message'],
              icon: 'success',
              timer: 2000,
              animation: true,
              showConfirmButton: false
            });
            this.router.navigate(['/agencies']);
          } else {
            this.toastr.error('Something went wrong!');
          }
        });
      }
    })
  }

  editAgency(userId) {
    const data = {
      userId: userId,
    }
    this.modalRef = this.modalService.open(EditAgencyComponent, { ariaLabelledBy: 'edit-agency', centered: true, size: 'lg' });
    this.modalRef.componentInstance.agencyData = data;
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

  onRate(e,agency){
    this.modalRef = this.modalService.open(RatingsReviewComponent, { ariaLabelledBy: 'rating-review-modal', centered: true, size: 'lg' })
    agency.review_type = 'CTA';
    agency.profile_id = agency.agencyId;
    this.modalRef.componentInstance.clinicianData = agency;
  }
}
