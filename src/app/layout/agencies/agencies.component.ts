import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from "@angular/router";
import Swal from 'sweetalert2';
import { EditAgencyComponent } from '../../modals/edit-agency/edit-agency.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../services/common.service';
import {RatingsReviewComponent} from '../../modals/ratings-review/ratings-review.component';

@Component({
  selector: 'app-agencies',
  templateUrl: './agencies.component.html',
  styleUrls: ['./agencies.component.scss'],
  animations: [routerTransition()],
  entryComponents: [EditAgencyComponent]
})
export class AgenciesComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('user'));
  classApplied = false;
  modalRef: NgbModalRef;
  agencies: any = [];
  listCounts: any = {};
  contentUrl = environment.host_url;
  agencyFilterForm: FormGroup;
  totalDataCount: number;
  p: number;
  agencySpecialityValues = [];
  agencySort = [
    {sortKey: 'agencyname_asc', sortValue: 'Agency Name'},
    {sortKey: 'fullname_asc', sortValue: 'Contact Person Name'},
  ];
  agencySortValues = [];
  agencySpecialities = [];
  pageNumber = [1];
  pageSize: number = 9;
  loading: boolean = false;

  data = {
    UserId: localStorage.getItem('userId'),
    Active: null,
    Start: 0,
    PageSize: this.pageSize,
    SortCol: "",
    SearchKey: "",
    AgencyTypeId: 0
  }

  isEditPermission:any= false;
  isDeletePermission:any = false;

  constructor(private authService: AuthService,
              private toastr: ToastrService,
              private fb: FormBuilder,
              private titleService: Title,
              private router: Router,
              private modalService: NgbModal,
              private commonService: CommonService) {
    this.agencyFilterForm = this.fb.group({
      name: [''],
      agencySpecialityValues: [],
      agencySortValues: []
    });


    this.commonService.getPermission('/agencies/edit').then(res => {
      this.isEditPermission = res;
      this.commonService.getPermission('/agencies/delete').then(res1 => {
        this.isDeletePermission = res1;
      });
    });
  }

  ngOnInit() {
    let self = this;
    $(window).click(function () {
      self.classApplied = false;
    });
    $('.page-header-filter').click(function (e) {
      e.stopPropagation();
    });

    this.titleService.setTitle('HomeHealthPro | Agencies');
    this.getAllAgencies();
    this.getAgencySpecialities();
  }

  onFilterToggle(e) {
    e.stopPropagation();
    this.classApplied = !this.classApplied;
  }

  pageChanged(newPage: number) {
    this.data.Start = (newPage - 1) * this.pageSize;
    this.getAgenciesData(this.data);
  }

  //returns all the agencies.
  getAgenciesData(data) {
    this.loading = true;
    this.authService.postRequest('agency/list', data).then((res) => {
      if (res['status']) {
        this.agencies = res['data'];
        this.listCounts = res['listCounts'];
        this.totalDataCount = res['recordsTotal'];
        this.loading = false;
      } else {
        this.toastr.error(res['message']);
      }
    });
  }

  getActiveInactiveAgencies(status = null) {
    this.data.Active = status;
    this.getAllAgencies();
  }

  filterAgencies() {
    this.data.Active = null;
    this.data.Start = 0;
    this.data.PageSize = this.totalDataCount;
    this.data.SearchKey = (this.agencyFilterForm.value.name) ? this.agencyFilterForm.value.name : "";
    this.data.AgencyTypeId = (this.agencyFilterForm.value.agencySpecialityValues) ? this.agencyFilterForm.value.agencySpecialityValues : 0;
    this.data.SortCol = (this.agencyFilterForm.value.agencySortValues) ? this.agencyFilterForm.value.agencySortValues : "";
    this.getAgenciesData(this.data);
    this.p = 1;
    this.classApplied = false;
  }

  getAllAgencies() {
    this.agencyFilterForm.reset();
    this.data.SearchKey = "";
    this.data.AgencyTypeId = 0;
    this.data.SortCol = "";
    this.data.Start = 0;
    this.data.PageSize = this.pageSize;
    this.pageNumber = [1];
    this.p = 1;
    this.getAgenciesData(this.data);
  }

  resetFilterForm() {
    this.data.Active = null;
    this.getAllAgencies();
  }

  getAgencySpecialities() {
    this.authService.postRequest('masterlist', {type: 'AGENCYTYPE'}).then((res) => {
      if (res['status']) {
        this.agencySpecialities = res['data'];
      } else {
        this.toastr.error(res['message']);
      }
    });
  }

  changeStatus(event) {
    var statusData = {UserId: event.target.id, Active: event.target.checked};
    this.authService.updateRequest('user/activestatus/update', statusData).then((res) => {
      if (res['status']) {
        this.toastr.success(res['message']);

        this.getAgenciesData(this.data);
      } else {
        this.toastr.error(res['message']);
      }
    });
  }

  agencyDetail(userId, agencyId) {
    localStorage.setItem('agencyId', agencyId);
    this.router.navigate(['agency-details', userId]);
  }

  deleteAgency(userId) {
    this.commonService.getPermission('/agencies/delete').then(res => {
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
            let agencyData = {UserId: userId, ActionType: 'DELT'};
            this.authService.deleteRequest('agency/delete', agencyData).then((res) => {
              if (res['status']) {
                this.data.Start = 0;
                this.p = 1;
                this.getAgenciesData(this.data);
                Swal.fire({
                  titleText: 'Deleted',
                  text: res['message'],
                  icon: 'success',
                  timer: 2000,
                  animation: true,
                  showConfirmButton: false
                });
              } else {
                this.toastr.error('Something went wrong!');
              }
            });
          }
        })
      } else {
        this.toastr.error("No permission");

      }
    });
  }

  editAgency(userId) {

    this.commonService.getPermission('/agencies/edit').then(res => {
      if (res) {
        const data = {
          userId: userId,
        }
        this.modalRef = this.modalService.open(EditAgencyComponent, {ariaLabelledBy: 'edit-agency', centered: true, size: 'lg'});
        this.modalRef.componentInstance.agencyData = data;
        this.modalRef.componentInstance.updateAgencyList.subscribe(() => {
          // this.getAllAgencies();
        });
      } else {
        this.toastr.error("No permission");

      }
    });
  }

  onRate(e,agency){
    this.modalRef = this.modalService.open(RatingsReviewComponent, { ariaLabelledBy: 'rating-review-modal', centered: true, size: 'lg' })
    agency.review_type = 'CTA';
    agency.profile_id = agency.agencyId;
    this.modalRef.componentInstance.clinicianData = agency;
  }
}
