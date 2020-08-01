import { Component, OnInit, Output, EventEmitter, Renderer } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { routerTransition } from '../../router.animations';
import {NgbModal, NgbModalOptions, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { CreateAdminComponent } from '../../modals/create-admin/create-admin.component';
import { EditAdminComponent } from '../../modals/edit-admin/edit-admin.component';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import Swal from "sweetalert2";
import { environment } from '../../../environments/environment';
import {CommonService} from '../../services/common.service';
import {del} from 'selenium-webdriver/http';

@Component({
  selector: 'app-manage-admins',
  templateUrl: './manage-admins.component.html',
  styleUrls: ['./manage-admins.component.scss'],
  animations: [routerTransition()],
  entryComponents: [CreateAdminComponent, EditAdminComponent]
})
export class ManageAdminsComponent implements OnInit {
  modalRef: NgbModalRef;
  dtOptions: any = {};
  listener: any;
  userIdListener: any;

  public user = JSON.parse(localStorage.getItem('user'));
  @Output() adminData = new EventEmitter();

  data = {
    Start: 0,
    PageSize: 5,
    SortCol: "",
    SearchKey: ""
  }
  isEditPermission:any= false;
  isDeletePermission:any = false;
  constructor(
    private titleService: Title,
    private modalService: NgbModal,
    private authService: AuthService,
    private toastr: ToastrService,
    private renderer: Renderer,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.titleService.setTitle('HomeHealthPro | Manage Admins');
    this.dataTable();


    this.commonService.getPermission('/Admin Users/edit').then(res => {
      if(res)
        this.isEditPermission = true;

      this.commonService.getPermission('/Admin Users/delete').then(res1 => {
        if(res1)
          this.isDeletePermission = true;

        if(this.user.role != 'SUPER_ADMIN')
        {
          if(this.isDeletePermission || this.isEditPermission)
          {
            var table = $('#admins-listing').DataTable();
            table.columns( [6] ).visible( true );

            table.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
              table.cell({row:rowIdx, column:6}).data('0');
            } );
          }else{
            var table = $('#admins-listing').DataTable();
            table.columns( [6] ).visible( false );

          }
        }

      });
    });
  }

  ngOnDestroy(): void {
    if (this.listener) {
      this.listener();
    }
  }

  ngAfterViewInit(): void {
    this.listener = this.renderer.listenGlobal('document', 'click', (event) => {
      // Manage Status Listener
      if (event.target.hasAttribute("manage-status-button")) {
        this.userIdListener = event.target.getAttribute("manage-status-button");
        this.changeActiveStatus(event, this.userIdListener);
      }

      // Edit Listener
      if (event.target.hasAttribute("edit-user-button")) {
        this.userIdListener = event.target.getAttribute("edit-user-button");
        this.editAdminModal(this.userIdListener);
      }

      // Delete Listener
      if (event.target.hasAttribute("delete-user-button")) {
        this.userIdListener = event.target.getAttribute("delete-user-button");
        this.deleteAdmin(this.userIdListener);
      }
    });
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
      ajax: {
        url: environment.api_url + 'admin/list',
        type: 'POST',
        'beforeSend': function (request) {
          var token = 'Bearer ' + localStorage.getItem('token');
          request.setRequestHeader('Authorization', token);
        },
        error: function (res) {

        },
        dataSrc: function (data) {

          return data['data'];
        },
      },
      initComplete: function() {

        $('#admins-listing_filter input').unbind();
        $('#admins-listing_filter input').bind('keyup', function(e) {
          var table = $('#admins-listing').DataTable();
          var val = $('#admins-listing_filter input').val();
          if(String(val).length > 3 || String(val).length == 0) {
            table.search(String(val)).draw();
          }
        });
      },
      columns: [
        {
          data: "fullName", title: "Admin User", render: function (data, type, row, meta) { return data ? data : '-' }
        },
        {
          data: "gender", title: "Gender", render: function (data, type, row, meta) { return data ? data : '-' }
        },
        {
          data: "dob", title: "DOB", render: function (data, type, row, meta) { return data ? data : '-' }
        },
        {
          data: "email", title: "Email", render: function (data, type, row, meta) { return data ? data.toLowerCase() : '-' }
        },
        {
          data: "jobTitle", title: "Job Title", render: function (data, type, row, meta) { return data ? data : '-' }
        },
        {
          data: "contactNo",
          title: "Phone",
          orderable: false,
          render: function (data, type, row, meta) { return data ? data : '-' }
        },
        {
          data: "userId",
          title: "Actions",
          searchable: false,
          orderable: false,
          render: function (data, type, row, meta) {

            var checked = row.active === 1 ? 'checked' : '';
            var edit = ''; var active = '';var del = '';
            if(self.isEditPermission || self.user.role == 'SUPER_ADMIN') {
              active = `<div class="manage-active toggle_btn"><label class="switch"><input type="checkbox" ` + checked + ` manage-status-button="` + row.userId + `"><span class="slider round"></span></label></div>`
              edit = `<div class="edit edit_btn" edit-user-button="` + row.userId + `">
                <div class="tooltipWrapper">
                  <div class="icon-wrapper" edit-user-button="` + row.userId + `"><i class="fa fa-pencil" edit-user-button="` + row.userId + `"></i></div>
                  <div class="tooltip bs-tooltip-top dtTooltip">
                    <div class="arrow"></div>
                    <div class="tooltip-inner">Edit</div>
                  </div>
                </div>
              </div>`
            }

            if(self.isDeletePermission || self.user.role == 'SUPER_ADMIN') {
              del = `<div class="delete delete_btn" delete-user-button="` + row.userId + `">
                <div class="tooltipWrapper">
                  <div class="icon-wrapper" title="Delete" delete-user-button="` + row.userId + `">
                    <i class="fa fa-trash" delete-user-button="` + row.userId + `"></i>
                  </div>
                  <div class="tooltip bs-tooltip-top dtTooltip">
                    <div class="arrow"></div>
                    <div class="tooltip-inner">Delete</div>
                  </div>
                </div>
              </div>`;
            }

            return `<div class="actions-wrapper">` + active + edit + del + `</div>`;
          }
        }
      ],
    };
  }

  addAdminModal() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      ariaLabelledBy: 'create-admin',
      centered: true,
      size: 'lg'
    };
    this.modalRef = this.modalService.open(CreateAdminComponent,ngbModalOptions);
    this.modalRef.componentInstance.updateAdminList.subscribe(() => {
      var table = $('#admins-listing').DataTable();
      table.ajax.reload();
    });
  }

  changeActiveStatus($event, userId) {
    const status = $event.target.checked;
    const data = {
      UserId: userId,
      Active: status
    }
    this.authService.updateRequest('user/activestatus/update', data).then((res) => {
      if ( res['status'] ){
        this.toastr.success( res['message'] );
      }
      if (!res['status']) {
        this.toastr.error(res['message']);
      }
    });
  }

  editAdminModal(adminId) {
    const data = {
      userId: adminId,
      role: "ADMIN"
    }
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      ariaLabelledBy: 'edit-admin',
      centered: true,
      size: 'lg'
    };
    this.modalRef = this.modalService.open(EditAdminComponent, ngbModalOptions);
    this.modalRef.componentInstance.adminData = data;
    this.modalRef.componentInstance.updateAdminList.subscribe(() => {
      var table = $('#admins-listing').DataTable();
      var pageInfo = table.page.info();
      table.page( pageInfo.page ).draw( 'page' );
      //table.ajax.reload();
    });
  }

  deleteAdmin(userId) {
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
        const data = {
          UserId: userId,
          ActionType: "DELT"
        }
        this.authService.deleteRequest('admin/delete', data).then((res) => {
          if (res['status']) {
            Swal.fire({
              titleText: 'Deleted',
              text: res['message'],
              icon: 'success',
              timer: 3000,
              animation: true,
              showConfirmButton: false
            });
            var table = $('#admins-listing').DataTable();
            table.ajax.reload();
          }
        })
      }
    })
  }

}
