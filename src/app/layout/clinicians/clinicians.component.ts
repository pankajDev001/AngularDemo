import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { RatingsReviewComponent } from '../../modals/ratings-review/ratings-review.component';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import {Router} from '@angular/router';
import Swal from "sweetalert2";
import {EditClinicianComponent} from '../../modals/edit-clinician/edit-clinician.component';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CommonService} from '../../services/common.service';
import * as signalR from '@aspnet/signalr';
import { HubConnection } from '@aspnet/signalr';

@Component({
  selector: 'app-clinicians',
  templateUrl: './clinicians.component.html',
  styleUrls: ['./clinicians.component.scss'],
  animations: [routerTransition()],
})
export class CliniciansComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('user'));
  classApplied = false;
  clinicianFilterForm: FormGroup;
  modalRef: NgbModalRef;
  clinicians = [];
  listCounts: any = {};
  contentUrl = environment.host_url;
  totalDataCount: number = 0;
  p: number;
  pageSize: number = 12;
  gender: any = [{value: 'Male', id: 'Male'}, {value: 'Female', id: 'Female'}];
  sortBy: any = [{value: 'Visit Fees (Low-High)', id: 'visitfees_asc'},
    {value: 'Visit Fees (High-Low)', id: 'visitfees_desc'},
    {value: 'Ratings (Low-High)', id: 'rating_asc'},
    {value: 'Ratings (High-Low)', id: 'rating_desc'}];
  langPreference: any = [];
  category: any = [];
  isViewPermission:any= false;
  isEditPermission:any= false;
  isDeletePermission:any = false;
  private hubConnection: HubConnection;
  loading: boolean = false;

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private toastr: ToastrService,
    private titleService: Title,
    private router: Router, private fb: FormBuilder,
    private commonService: CommonService
  ) { }

  data = {
    UserId: localStorage.getItem('userId'),
    Active : null,
    PatientTypeId: 0,
    Start: 0,
    PageSize: this.pageSize,
    SortCol: "",
    SearchKey: "",
    Gender : "",
    CategoryId : 0,
    LanguageId : 0,
  }

  ngOnInit() {

/*    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://172.16.3.2:56865/notificationHub").build();*/


    let self = this;
    $(window).click(function() {
      self.classApplied = false;
    });
    $('.page-header-filter').click(function(e){
      e.stopPropagation();
    });

    this.clinicianFilterForm = this.fb.group({
      name: [''],
      gender: [],
      langPreference: [],
      category: [],
      sortBy: [],
    });

    this.titleService.setTitle('HomeHealthPro | Clinicians')
    this.getAllClinicians(this.data);
    this.getFilters();
  }
  ngOnDestroy(){
    if (this.hubConnection) {
     // this.hubConnection.stop();
    //  this.hubConnection= undefined;
    }
  }

  ngAfterViewInit(){
    this.commonService.getPermission('/clinicians/list').then(res => {
      this.isViewPermission = res;
      this.commonService.getPermission('/clinicians/edit').then(res1 => {
        this.isEditPermission = res1;
        this.commonService.getPermission('/clinicians/delete').then(res2 => {
          this.isDeletePermission = res2;
        });
      });
    });
  }

  onFilterToggle(e){
    e.stopPropagation();
    this.classApplied = !this.classApplied;
  }

  getAllClinicians(data) {
    this.loading  = true;
    this.authService.postRequest('clinician/list', data).then((res) => {
      if (res['status']) {
        this.clinicians = res['data'];
        this.listCounts = res['listCounts'];
        this.totalDataCount = res['recordsTotal'];
        this.loading = false;
      }
      if (res['status'] === false) {
        this.toastr.error(res['message']);
      }
    });
  }

  getFilters() {
    this.authService.postRequest('masterlist', { type: 'LANGUAGE' }).then((res) => {
      if (res['status']) {
        this.langPreference = res['data'];
      } else {
        this.toastr.error(res['message']);
      }
    });

    this.authService.postRequest('masterlist', { type: 'CATEGORY' }).then((res) => {
      if (res['status']) {
        this.category = res['data'];
      } else {
        this.toastr.error(res['message']);
      }
    });
  }

  getCardList(type){
    this.data.Active = type;
    this.data.Start = 0;
    this.p = 1;

    this.getAllClinicians(this.data);
  }

  pageChanged(newPage: number) {
    this.data.Start = ( newPage - 1 ) * this.pageSize;
    this.getAllClinicians(this.data);
  }

  open() {
    this.modalRef = this.modalService.open(RatingsReviewComponent, { ariaLabelledBy: 'rating-review-modal', centered: true, size: 'lg' })
  }

  goToClinician(data) {
    this.router.navigate(['/clinician-details', data.userId]);
  }

  editClinician(data) {

    this.commonService.getPermission('/clinicians/edit').then(res => {
      if (res) {
        this.modalRef = this.modalService.open(EditClinicianComponent, {
          ariaLabelledBy: 'edit-clinician',
          centered: true,
          size: 'lg',
          backdrop: 'static',
          keyboard: false
        });
        this.modalRef.componentInstance.clinicianData = data;
        this.modalRef.componentInstance.updateCliniciansList.subscribe(() => {
          this.getAllClinicians(this.data);
        });
      }else{
        this.toastr.error("No permission");

      }
    });
  }

  changeStatus(data, event) {
    var statusData = { UserId: data.userId, Active: event.target.checked };
    this.authService.updateRequest('user/activestatus/update', statusData).then((res) => {
      if (res['status']) {
        this.toastr.success(res['message']);
        this.getAllClinicians(this.data);
      } else {
        this.toastr.error(res['message']);
      }
    });
  }

  filterClinicians(){
    this.data.Active = null;
    this.data.Start = 0;
    this.data.PageSize = this.pageSize;
    this.data.SearchKey = (this.clinicianFilterForm.value.name) ? this.clinicianFilterForm.value.name : '';
    this.data.Gender = (this.clinicianFilterForm.value.gender) ? this.clinicianFilterForm.value.gender : '';
    this.data.LanguageId = (this.clinicianFilterForm.value.langPreference) ? this.clinicianFilterForm.value.langPreference :0;
    this.data.CategoryId = (this.clinicianFilterForm.value.category) ? this.clinicianFilterForm.value.category :0;
    this.data.SortCol = (this.clinicianFilterForm.value.sortBy) ? this.clinicianFilterForm.value.sortBy : '';
    this.getAllClinicians(this.data);
    this.p = 1;
    this.classApplied = false;
  }

  resetFilterForm() {
    this.clinicianFilterForm.reset();
    this.filterClinicians();
  }

  deleteClinician(data) {

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
            this.authService.deleteRequest('clinician/delete', {UserId: data.userId, ActionType: "DELT"}).then((res) => {
              if (res['status']) {
                this.data.Start = 0;
                this.p = 1;
                this.getAllClinicians(this.data);
                Swal.fire({
                  titleText: 'Deleted',
                  text: res['message'],
                  icon: 'success',
                  timer: 2000,
                  animation: true,
                  showConfirmButton: false
                });
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

  onRate(e,clinician){
    this.modalRef = this.modalService.open(RatingsReviewComponent, { ariaLabelledBy: 'rating-review-modal', centered: true, size: 'lg' })
    clinician.review_type = 'ATC';
    clinician.profile_id = clinician.clinicianId;
    this.modalRef.componentInstance.clinicianData = clinician;

  }

  goToVist(clinician) {

    this.commonService.setScope('clinician_data' , JSON.stringify(clinician));
    this.router.navigate(['scheduled-visits/add/1']);

  }
}
