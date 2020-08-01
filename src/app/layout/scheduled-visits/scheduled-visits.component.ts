import { Component, OnInit, Renderer, Output, EventEmitter } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import {NgbModal, NgbModalOptions, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { VisitDetailsComponent } from '../../modals/visit-details/visit-details.component';
import {WriteReviewComponent} from '../../modals/write-review/write-review.component';
import {VisitCliniciansComponent} from '../../modals/visit-clinicians/visit-clinicians.component';
import {AcceptedCliniciansComponent} from '../../modals/accepted-clinicians/accepted-clinicians.component';
import {RescheduleVisitComponent} from '../../modals/reschedule-visit/reschedule-visit.component';
import {CancelVisitComponent} from '../../modals/cancel-visit/cancel-visit.component';
import { CompletedReviewComponent } from 'src/app/modals/completed-review/completed-review.component';

@Component({
  selector: 'app-scheduled-visits',
  templateUrl: './scheduled-visits.component.html',
  styleUrls: ['./scheduled-visits.component.scss'],
  animations: [routerTransition()]
})
export class ScheduledVisitsComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('user'));
  classApplied = false;
  scrollbarOptions: any = {};
  dtOptions: any = {};
  modalRef: NgbModalRef;
  listener: any;
  visitIdListener: any;
  scheduledVisits = [{id: 'ALL', value: 'ALL'}];
  data: any = {
    Status: ""
  }
  visit_list: any;
  interval: any = [];
  @Output() visitId = new EventEmitter();

  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private titleService: Title,
    private renderer: Renderer,
    private modalService: NgbModal,
  ) {}

  ngOnInit() {
    this.titleService.setTitle('HomeHealthPro | Scheduled Visits');

    let self = this;
    $(window).click(function() {
      self.classApplied = false;
    });
    $('.page-header-filter').click(function(e){
      e.stopPropagation();
    });

    this.scrollbarOptions = {
      axis: 'x',
      theme: 'healthPro-scrollbar',
    };

    this.getVisitStatus();
    this.dataTable();

    $('#scheduled-visits').on( 'page.dt', function () {
      for ( var i = 0; i < self.interval.length; ++i )
        clearInterval( self.interval[i] );

    } );

    $('#scheduled-visits').on('search.dt', function() {
      for ( var i = 0; i < self.interval.length; ++i )
        clearInterval( self.interval[i] );
    })
  }

  ngOnDestroy(): void {
    if (this.listener) {
      this.listener();
    }

    for ( var i = 0; i < this.interval.length; ++i )
      clearInterval( this.interval[i] );

  }

  ngAfterViewInit(): void {
    this.listener = this.renderer.listenGlobal('document', 'click', (event) => {
      // Details Listener
      if (event.target.hasAttribute("scheduled-visit-details-button")) {
        this.visitIdListener = event.target.getAttribute("scheduled-visit-details-button");
        this.openDetailModal(this.visitIdListener);
      }


      if (event.target.hasAttribute("review-button") && this.user.role == 'AGENCY') {
        let visitId = event.target.getAttribute('review-button');
        this.openReviewModal(visitId);
      }

      if (event.target.hasAttribute("completed-review-button")) { //&& this.user.role == 'AGENCY'
        var visitId = event.target.getAttribute('completed-review-button');
        var reviewFor = event.target.getAttribute('review-for');
        const data = 
          {
            'visitId': visitId,
            'profileId': (reviewFor === 'CTA') ? event.target.getAttribute('visit-agency-id') : event.target.getAttribute('visit-clinician-id'),
            'reviewFor': reviewFor
          }
        
        this.openCompletedReviewModal(data);
      }
      

      if (event.target.hasAttribute("scheduled-visit-accptclinicians-button")) {
        this.visitIdListener = event.target.getAttribute("scheduled-visit-accptclinicians-button");
        this.openAcceptedCliniciansModal(this.visitIdListener); // 1: accepted true
      }

      if (event.target.hasAttribute("scheduled-visit-reqclinicians-button")) {
        this.visitIdListener = event.target.getAttribute("scheduled-visit-reqclinicians-button");
        this.openCliniciansModal(this.visitIdListener);// 2: requested true
      }

      if (event.target.hasAttribute("rescheduled-visit-button")) {
        this.visitIdListener = event.target.getAttribute("rescheduled-visit-button");
        let isVisitDateFlexible = this.visit_list.filter(item => item.visitId == this.visitIdListener && item.isVisitDateFlexible);
        if(isVisitDateFlexible.length > 0 && isVisitDateFlexible[0].visitStatus != 'RESCHEDULED')
          this.openRescheduleModal(this.visitIdListener);
        else
          this.toastr.error('Visit cannot be rescheduled because visit date is inflexible.');
      }

      if (event.target.hasAttribute("cancel-button")) {

        this.visitIdListener = event.target.getAttribute("cancel-button");
        let isCancelled = this.visit_list.filter(item => item.visitId == this.visitIdListener);
        if(isCancelled.length > 0 && isCancelled[0].visitStatus != 'CANCELLED')
          this.cancelVisitModal(this.visitIdListener);
        else
          this.toastr.error('Cannot cancel visit')
      }
    });
  }

  onFilterToggle(e){
    e.stopPropagation();
    this.classApplied = !this.classApplied;
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
      createdRow: function( row, data, dataIndex ) {
        // Set the data-status attribute, and add a class
        $(row).addClass('responsiveGrid');
      },
      responsive: true,
      order: [0, 'desc'],
      ajax: {
        url: environment.api_url + 'visit/list',
        type: 'POST',
        'beforeSend': function (request) {
          var token = 'Bearer ' + localStorage.getItem('token');
          request.setRequestHeader('Authorization', token);
        },
        data: function(data){
          data['Active'] = true;
          data['Status'] = self.data.Status;
          data['AgencyId'] = self.user.role === "AGENCY" ? self.user.profileId : '';
          data['ClinicianId'] = "";
        },
        error:function (res) {},
        dataSrc: function (data) {

          self.visit_list = data['data'];
          return data['data'];
        },
      },
      initComplete: function(settings,json) {
        $('#scheduled-visits_filter input').unbind();
        $('#scheduled-visits_filter input').bind('keyup', function(e) {
          var table = $('#scheduled-visits').DataTable();
          var val = $('#scheduled-visits_filter input').val();
          if(String(val).length > 3 || String(val).length == 0) {
            table.search(String(val)).draw();
          }
        });

      },
      rowCallback:function(t,d,displayNum,dispIndex,dataIndex){
        let data = d;
          let el = document.getElementById("time-" + data.visitId+'-'+dataIndex);
          var tiempo = d.agencyApprovalEndTime;
          if(tiempo) {
            var splitDate = tiempo.split(" ");
           // console.log(new Date(tiempo));

            var date = splitDate[0].split("/");
            var time = splitDate[1].split(":");
            var dd = date[2];
            var mm = date[1];
            var yyyy = date[0];
            var hh = time[0];
            var min = time[1];
            var ss = time[2];

            let countDownDate = new Date(tiempo).getTime();
            var x = setInterval(function () {
              var now = new Date().getTime();
              var distance = countDownDate - now;
              var hours   = Math.floor(distance / 3.6e6);
              var minutes = Math.floor((distance % 3.6e6) / 6e4);
              var seconds = Math.floor((distance % 6e4) / 1000);
              document.getElementById("time-" + data.visitId+'-'+dataIndex).innerHTML = hours + ":" + minutes + ":" + seconds;
              self.interval.push(x);
              if (distance < 0) {
                clearInterval(x);
                document.getElementById("time-" + data.visitId+'-'+dataIndex).innerHTML = "EXPIRED";
              }
            }, 1000);
        }
      },
      columns: [
        {
          data: "createdOn",
          title: "",
          type:'date',
          visible: false,
          render: function (data, type, row, meta) { return data ? data : '-' }
        },
        {
          data: "patientName",
          title: "Patient Name",
          render: function (data, type, row, meta) { return data ? data : '-' }
        },
        {
          visible: self.user.role != "AGENCY",
          data: "agencyName",
          title: "Agency Name",
          render: function (data, type, row, meta) { return data ? data : '-' }
        },
        {
          data: "clinicianName",
          title: "Clinician Name",
          render: function (data, type, row, meta) {

            return data ? data : '';
          }
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
          data: "noOfVisitsNeeded",
          title: "No. Of Visits",
          className: 'text-center',
          render: function (data, type, row, meta) { return data ? data : '-' }
        },
        {
          data: "visitStatus",
          title: "Status",
          render: function (data, type, row, meta) {
            var completed = '<span class="badge badge-success badge-pill">Completed</span>';
            var created = '<span class="badge badge-caret badge-pill">Assigned</span>';
            var rescheduled = '<span class="badge badge-rescheduled badge-pill">Rescheduled</span>';
            var cancelled = '<span class="badge badge-danger badge-pill">Cancelled</span>';
            var serviceProvided = '<span class="badge badge-info badge-pill">Service Provided</span>';
            var pending = '<span class="badge badge-secondary badge-pill">Pending</span>';
            var inProgress = '<span class="badge badge-warning badge-pill">In-Progress</span>';

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
          title: "Actions",
          className:"text-center",
          orderable: false,
          render: function (data, type, row, meta) {
            var view = `<div class="tooltipWrapper">
                          <div class="icon-wrapper" scheduled-visit-details-button="`+data+`">
                            <i class="fa fa-eye" scheduled-visit-details-button="`+data+`"></i>
                          </div>
                          <div class="tooltip bs-tooltip-top dtTooltip">
                            <div class="arrow"></div>
                            <div class="tooltip-inner">View</div>
                          </div>
                        </div>`
            var reschedule = `<div class="tooltipWrapper">
                                <div class="icon-wrapper" rescheduled-visit-button="`+data+`">
                                  <i class="fa fa-repeat" rescheduled-visit-button="`+data+`"></i>
                                </div>
                                <div class="tooltip bs-tooltip-top dtTooltip">
                                  <div class="arrow"></div>
                                  <div class="tooltip-inner">Reschedule</div>
                                </div>
                              </div>`
            var cancel = `<div class="tooltipWrapper">
                            <div class="icon-wrapper" cancel-button="`+data+`">
                              <i class="fa fa-ban" cancel-button="`+data+`"></i>
                            </div>
                            <div class="tooltip bs-tooltip-top dtTooltip">
                              <div class="arrow"></div>
                              <div class="tooltip-inner">Cancel</div>
                            </div>
                          </div>`

              
                        if(self.user.role === 'AGENCY'){
                          if(row.visitStatus == 'SERVICE-PROVIDED' || row.visitStatus == 'COMPLETED' || row.visitStatus == 'CANCELLED'){
                            return data ? '<div class="actions-wrapper justify-content-start">'+view+'</div>' : '-';
                          }else{
                            return data ? '<div class="actions-wrapper justify-content-center">'+view+reschedule+cancel+'</div>' : '-';
                          }
                          
                        }else{
                          return data ?  '<div class="actions-wrapper justify-content-center">'+view+'</div>' : '-';
                        }
              
            
          }
        },
        {
          data: "requestedClinicians",
          title: "Requested Clinicians",
          className: 'text-center',
          orderable: false,
          render: function (data, type, row, meta) {
            var button = `<div class="tooltipWrapper">
                          <div class="icon-wrapper text-white" scheduled-visit-reqclinicians-button="`+row.visitId+`">
                          `+data+`
                          </div>
                          <div class="tooltip bs-tooltip-top dtTooltip">
                            <div class="arrow"></div>
                            <div class="tooltip-inner">Click to see details</div>
                          </div>
                        </div>`

            if(self.user.role === 'AGENCY'){
              return data ? '<div class="actions-wrapper justify-content-center">'+button+'</div>' : '-';
            }else{
              return data ?  '<div class="actions-wrapper justify-content-center" style="font-weight: bold;font-size: 20px;">'+data+'</div>' : '-';
            } 
          }
        },
        {
          data: "visitId",
          orderable: false,
          className: 'reviewColumn',
          title: "<div class='text-center'>Reviewed by</div> <div class='grid3'><span class='p-1 text-center'>Clinician</span><span class='p-1 text-center'>Agency</span><span class='p-1 text-center'>Patient</span></div>",
          render: function(data, type, row, meta){
            var reviewCompleted = "<span class='text-center'><div class='tooltipWrapper'><i class='fa fa-check review-icon' completed-review-button='"+data+"' review-for='{{reviewfor}}' visit-clinician-id='"+row.clinicianId+"' visit-agency-id='"+row.agencyId+"'></i><div class='tooltip bs-tooltip-top dtTooltip'><div class='arrow'></div><div class='tooltip-inner'>Completed</div></div></div></span>";

            var reviewPending = "<span class='text-center'><div class='tooltipWrapper'><i class='fa fa-exclamation review-icon bg-danger text-white'></i><div class='tooltip bs-tooltip-top dtTooltip'><div class='arrow'></div><div class='tooltip-inner'>Pending</div></div></div></span>";

            if(self.user.role == 'AGENCY' && (row.visitStatus == 'SERVICE-PROVIDED' || row.visitStatus == 'COMPLETED')) {
              let Clinician = row.isClinicianReviewedAgency ? reviewCompleted.replace('{{reviewfor}}', 'CTA') : reviewPending;

              let Agency = row.isAgencyReviewedClinician ? reviewCompleted.replace('{{reviewfor}}', 'ATC') : "<span class='text-center'><div class='tooltipWrapper cursor-pointer'><i class='fa fa-pencil review-icon' review-button='"+data+"'></i><div class='tooltip bs-tooltip-top dtTooltip'><div class='arrow'></div><div class='tooltip-inner'>Write Review</div></div></div></span>";

              let Patient = row.isPatientReviewedClinician ? reviewCompleted.replace('{{reviewfor}}', 'PTC') : reviewPending;

              return "<div class='grid3'>" + Clinician + "" + Agency + "" + Patient + "</div>";
            }else if(self.user.role != 'AGENCY' && (row.visitStatus == 'SERVICE-PROVIDED' || row.visitStatus == 'COMPLETED')){

              let Clinician = row.isClinicianReviewedAgency ? reviewCompleted.replace('{{reviewfor}}', 'CTA') : reviewPending;

              let Agency = row.isAgencyReviewedClinician ? reviewCompleted.replace('{{reviewfor}}', 'ATC') : reviewPending;

              let Patient = row.isPatientReviewedClinician ? reviewCompleted.replace('{{reviewfor}}', 'PTC') : reviewPending;

              return "<div class='grid3'>" + Clinician + "" + Agency + "" + Patient + "</div>";
            }else{
              return "<div class='grid3'>" + "<span class='text-center'>-</span>" + "" + "<span class='text-center'>-</span>" + "" + "<span class='text-center'>-</span>" + "</div>";
            }
          }
        },
        {
          data: "agencyApprovalEndTime",
          title: "Clinical Notes Approval time",
          orderable: false,
          className: 'text-center',
          width:'15%',
          render: function (data, type, row, meta) {
            if(data) {
              return '<p class="mb-0" id="time-'+row.visitId+'-'+meta.row+'" get-time="'+data+'"></p>';
            }else
              return '-'
          }
        },
      ]
    }
  }

  getVisitStatus() {
    this.authService.postRequest('masterlist', { Type: 'VISITSTATUS' }).then((res) => {
      if ( res['status'] ) {
        this.scheduledVisits = [ ...this.scheduledVisits, ...res['data'] ];
      }
      if( !res['status'] ){
        this.toastr.error( res['message'] );
      }
    });
  }

  onChangePatientVisit(event) {
    var status = (event.id) ? event.id : null;
    if (status == 'ALL') {
      this.data.Status = '';
    } else {
      this.data.Status = status;
    }
    var table = $('#scheduled-visits').DataTable();
    table.ajax.reload();
    this.classApplied = false;
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

  openAcceptedCliniciansModal(visitId){
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      ariaLabelledBy: 'visit-details',
      centered: true,
      size: 'lg'
    };
    this.modalRef = this.modalService.open(AcceptedCliniciansComponent, ngbModalOptions);
    this.modalRef.componentInstance.visitId = visitId;
  }

  openCliniciansModal(visitId){
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      ariaLabelledBy: 'visit-details',
      centered: true,
      size: 'lg'
    };
    this.modalRef = this.modalService.open(VisitCliniciansComponent, ngbModalOptions);
    this.modalRef.componentInstance.visitId = visitId;
    this.modalRef.componentInstance.updateScheduleVisitList.subscribe(res => {
      if(res)
      {
        var table = $('#scheduled-visits').DataTable();
        table.ajax.reload();
      }
    })

  }

  openReviewModal(visitId){
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      ariaLabelledBy: 'visit-details',
      centered: true,
      size: 'lg'
    };
    this.modalRef = this.modalService.open(WriteReviewComponent, ngbModalOptions);
    this.modalRef.componentInstance.visitId = visitId;
    this.modalRef.componentInstance.updateVisitList.subscribe(res => {
      if(res)
      {
        var table = $('#scheduled-visits').DataTable();
        table.ajax.reload();
      }
    });
  }

  openCompletedReviewModal(data){
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      ariaLabelledBy: 'visit-details',
      centered: true,
      size: 'lg'
    };
    this.modalRef = this.modalService.open(CompletedReviewComponent, ngbModalOptions);
    this.modalRef.componentInstance.review = data;
    // this.modalRef.componentInstance.updateVisitList.subscribe(res => {
    //   if(res)
    //   {
    //     var table = $('#scheduled-visits').DataTable();
    //     table.ajax.reload();
    //   }
    // });
  }


  openRescheduleModal(visitId){
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      ariaLabelledBy: 'visit-details',
      centered: true,
      size: 'lg'
    };
    this.modalRef = this.modalService.open(RescheduleVisitComponent, ngbModalOptions);
    this.modalRef.componentInstance.visitId = visitId;
    this.modalRef.componentInstance.updateVisitList.subscribe(res => {
      if(res)
      {
        var table = $('#scheduled-visits').DataTable();
        table.ajax.reload();
      }
    })
  }

  cancelVisitModal(visitId){
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      ariaLabelledBy: 'visit-details',
      centered: true,
      size: 'lg'
    };
    this.modalRef = this.modalService.open(CancelVisitComponent, ngbModalOptions);
    this.modalRef.componentInstance.visitId = visitId;
    this.modalRef.componentInstance.cancelVisitReferesh.subscribe(res => {
      if(res)
      {
        var table = $('#scheduled-visits').DataTable();
        table.ajax.reload();
      }
    })
  }
}
