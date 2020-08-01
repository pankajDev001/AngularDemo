import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Subject} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-accepted-clinicians',
  templateUrl: './accepted-clinicians.component.html',
  styleUrls: ['./accepted-clinicians.component.scss']
})
export class AcceptedCliniciansComponent implements OnInit {
  @Input() public visitId;
  @Output() updateScheduleVisitList = new EventEmitter();

  accepted_clinicians: any = [];
  rejected_clinicians: any = [];
  dtOptions: any = {};
  dtTrigger = new Subject();
  dtTrigger1 = new Subject();
  constructor( private authService: AuthService,
               private toastr: ToastrService,
               private modalService: NgbModal) {
    this.dtOptions = {
      paging: false,
      ordering: false,
      info: false,
      responsive: true,
      initComplete: function() {

        $('#accepted-clinician_filter input').unbind();
        $('#accepted-clinician_filter input').bind('keyup', function(e) {
          var table = $('#accepted-clinician').DataTable();
          var val = $('#accepted-clinician_filter input').val();
          if(String(val).length > 3 || String(val).length == 0) {
            table.search(String(val)).draw();
          }
        });
      },
      columnDefs: [
        {
          visible: false,
          targets: [4,5]
        }],
      select: {
        style:    'single',
        selector: 'td:first-child'
      },
      language: {
        emptyTable: "No data available in table"
      }
    };
  }

  ngOnInit() {
    this.authService.postRequest('clinician/visit/request/status', {VisitId: this.visitId, isAccepted: true, isAssigned: false, isDeclined: false, isRequested: false}).then((res) => {
      if( res['status'] ){
        this.accepted_clinicians = res['data'];
        this.dtTrigger.next();

        this.authService.postRequest('clinician/visit/request/status', {VisitId: this.visitId, isAccepted: false, isAssigned: false, isDeclined: true, isRequested: false}).then((res) => {
          if( res['status'] ){
            this.rejected_clinicians = res['data'];
            this.dtTrigger1.next();
          }
          if( !res['status'] ){

            this.toastr.error(res['message']);
          }
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

}
