import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../../services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-visit-clinicians',
  templateUrl: './visit-clinicians.component.html',
  styleUrls: ['./visit-clinicians.component.scss']
})
export class VisitCliniciansComponent implements OnInit {
  @Input() public visitId;
  @Output() updateScheduleVisitList = new EventEmitter();
  accepted_clinicians = [];
  rejected_clinicians = [];
  unresponed_clinicians = [];
  visitDetails: any = [];
  dtOptions: any = {};
  dtOptions1: any = {};
  dtOptions2: any = {};
  dtTrigger = new Subject();
  constructor( private authService: AuthService,
               private toastr: ToastrService,
               private modalService: NgbModal) {


  }

  ngOnInit() {


    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2,
      ordering: false,
      info: false,
      responsive: true,
      lengthMenu: [[5, 10, 15], [5, 10, 15]],
      initComplete: function() {

        $('#assign-clinician_filter input').unbind();
        $('#assign-clinician_filter input').bind('keyup', function(e) {
          var table = $('#assign-clinician').DataTable();
          var val = $('#assign-clinician_filter input').val();
          if(String(val).length > 3 || String(val).length == 0) {
            table.search(String(val)).draw();
          }
        });
      },
      columnDefs: [ {
        orderable: false,
        className: 'select-checkbox',
        targets:   0,
      },
        {
          visible: false,
          targets: [5,6]
        }],
      select: {
        style:    'single',
        selector: 'td:first-child'
      },
      language: {
        emptyTable: "No data available in table"
      }
    };

    this.dtOptions1 = {
      pagingType: 'full_numbers',
      pageLength: 2,
      ordering: false,
      info: false,
      responsive: true,
      lengthMenu: [[5, 10, 15], [5, 10, 15]],

    };

    this.dtOptions2 = {
      pagingType: 'full_numbers',
      pageLength: 2,
      lengthMenu: [[5, 10, 15], [5, 10, 15]],
      ordering: false,
      info: false,
    }


    this.authService.postRequest('clinician/visit/request/status', {VisitId: this.visitId, isAccepted: false, isAssigned: false, isDeclined: false, isRequested: true}).then((res) => {
      if( res['status'] ){
        this.visitDetails = res['data'];

        this.visitDetails.forEach(item => {

          if(item.isAccepted)
            this.accepted_clinicians.push(item)
          else if(item.isDeclined)
            this.rejected_clinicians.push(item);
          else
            this.unresponed_clinicians.push(item);
        });


        setTimeout(() =>{
          this.dtTrigger.next();
        });

      }
      if( !res['status'] ){

        this.toastr.error(res['message']);
      }
    });
  }


  close(){
    this.modalService.dismissAll();
  }

  assignClinician(){

   var table =  $('#assign-clinician').DataTable();

   let data = table.rows('.selected').data();
    let clinicianid = null;
    if(data[0]){

      clinicianid = data[0][6];

      this.authService.updateRequest('visit/request/update', {VisitId: this.visitId, ClinicianId: clinicianid, isAccepted: false, isAssigned: true, isDeclined: false, IsRequestLimitExpired: false}).then((res) => {
        if( res['status'] ){
          this.modalService.dismissAll();
          this.toastr.success(res['message']);
          this.updateScheduleVisitList.emit(true);
        }
        if( !res['status'] ){

          this.toastr.error(res['message']);
        }
      });
    }

  }

}
