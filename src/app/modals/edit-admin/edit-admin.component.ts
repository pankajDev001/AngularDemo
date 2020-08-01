import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-edit-admin',
  templateUrl: './edit-admin.component.html',
  styleUrls: ['./edit-admin.component.scss']
})
export class EditAdminComponent implements OnInit {
  submitted: boolean = false;
  closeResult: string;
  modalRef: NgbModalRef;
  EditAdminForm: FormGroup;
  maxDate = undefined;
  myDate = [];

  public admin: any;
  public userId: any;
  public role: any;
  public date: any;
  public active: any;
  
  gender = [
    { name: 'Male' },
    { name: 'Female' }
  ]

  @Input() public adminData;
  @Output() updateAdminList = new EventEmitter();
  getDate = new Date();
  day = this.getDate.getDate()
  month = this.getDate.getMonth() + 1
  year = this.getDate.getFullYear()
  today = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day:new Date().getDate()};
  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private dateConfig: NgbDatepickerConfig,
    private commonService: CommonService
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
    this.editFromInit();
    this.userId = this.adminData.userId;
    this.role = this.adminData.role;

    const data = {
      userId: this.userId,
      role: this.role
    }

    this.authService.postRequest('admin/get', data).then((res) => {
      if (res['status']) {
        this.admin = res['data'].user;
        this.date = this.admin.dob;
        // console.log( this.date);
        let date = this.admin.dob ? new Date(this.admin.dob) : null;

        this.date = this.datePipe.transform(this.admin.dob, 'MM/dd/yyyy');
        this.admin.dob = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
        this.active = this.admin.active;
        this.EditAdminForm.patchValue({
          FirstName: this.admin ? this.admin.firstName : '',
          LastName: this.admin ? this.admin.lastName : '',
          Gender: this.admin ? this.admin.gender : '',
          ContactNo: this.admin ? this.admin.contactNo : '',
          JobTitle: this.admin ? this.admin.jobTitle : '',
          Email: this.admin ? this.admin.email : '',
          DOB: this.admin ? this.admin.dob : '',
        });
      }
      if (!res['status']) {
        this.toastr.error(res['message']);
      }
    });
  }

  editFromInit() {
    this.EditAdminForm = this.formBuilder.group({
      FirstName: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z]*$'),
          Validators.minLength(2),
          Validators.maxLength(25)
        ]
      ],
      LastName: ['', 
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z]*$'),
          Validators.minLength(2),
          Validators.maxLength(25)
        ]
      ],
      Gender: ['', Validators.required],
      ContactNo: ['',
        [
          Validators.required,
          Validators.pattern('([0-9]{0,})'),
          Validators.minLength(10),
          Validators.maxLength(10)
        ]
      ],
      JobTitle: ['', 
        [
          Validators.required,
          Validators.pattern('^([A-Za-z]+ )+[A-Za-z]+$|^[A-Za-z]+$'),
          Validators.minLength(2),
          Validators.maxLength(25)
        ]
      ],
      DOB: ['', Validators.required],
      Email: ['',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
        ]
      ]
    });
    this.EditAdminForm.controls.Email.disable();
  }

  onDateSelect($event) {
    const dob = this.EditAdminForm.value.DOB.year + '-' + this.EditAdminForm.value.DOB.month + '-' + this.EditAdminForm.value.DOB.day;
    this.date = this.datePipe.transform(dob, 'MM/dd/yyyy');
  }

//   getErrors(formGroup: FormGroup, errors: any = {}) {
//     Object.keys(formGroup.controls).forEach(field => {
//         const control = formGroup.get(field);
//         if (control instanceof FormControl) {
//             errors[field] = control.errors;
//         } else if (control instanceof FormGroup) {
//             errors[field] = this.getErrors(control);
//         }
//     });
//     return errors;
// } 
  onSubmit() {
    
    this.submitted = true;
    // console.log(this.getErrors(this.EditAdminForm));
    if(!this.EditAdminForm.valid){
      return;
    }
    else{
      
      let PhoneNumber = this.commonService.formatPhoneNumber(this.EditAdminForm.value.ContactNo);
      const data = {
        FirstName: this.EditAdminForm.value.FirstName,
        LastName: this.EditAdminForm.value.LastName,
        Gender: this.EditAdminForm.value.Gender,
        ContactNo: (PhoneNumber) ? PhoneNumber: '',
        JobTitle: this.EditAdminForm.value.JobTitle,
        Email: this.EditAdminForm.value.Email,
        DOB: this.date,
        UserId: this.userId,
        Role: this.role,
        Active: this.active
      }
      
      this.authService.updateRequest('admin/update', data).then((res) => {
        if (res['status']) {
          this.close();
          this.toastr.success(res['message']);
          this.updateAdminList.emit();
        }
      });
    }
  }

  close() {
    this.modalService.dismissAll();
  }
}
