import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgbModal, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.scss']
})
export class CreateAdminComponent implements OnInit {
  submitted: boolean = false;
  closeResult: string;
  public date;
  public newFormatedNumber;
  maxDate = undefined;
  gender = [
    {name: 'Male'},
    {name: 'Female'}
  ]

  @Output() updateAdminList = new EventEmitter();
  getDate = new Date();
  day = this.getDate.getDate()
  month = this.getDate.getMonth() + 1
  year = this.getDate.getFullYear()
  today = {year: new Date().getFullYear(), month: new Date().getMonth() + 1, day:new Date().getDate()};
  constructor(
    public router: Router,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private dateConfig: NgbDatepickerConfig,
  ) {
    // this.dateConfig.minDate = { year: 1950, month: 1, day: 1 };
    // this.dateConfig.maxDate = { year: 2010, month: 12, day: 31 };
    // this.dateConfig.startDate = { year: 1950, month: 1 }
    this.dateConfig.outsideDays = 'hidden';
  }

  ngOnInit() { }

  close() {
    this.modalService.dismissAll();
  }

  createAdminForm = this.formBuilder.group({
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
    Gender: [, Validators.required],
    Phone: ['',
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
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$')
      ]
    ],
  });

  onDateSelect($event) {
    const dob = this.createAdminForm.value.DOB.year + '-' + this.createAdminForm.value.DOB.month + '-' + this.createAdminForm.value.DOB.day;
    this.date = this.datePipe.transform(dob, 'MM/dd/yyyy');
  }

  formatPhoneNumber(phoneNumberString) {
    var match = phoneNumberString.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      this.newFormatedNumber = match[1] + '-' + match[2] + '-' + match[3]
    }
    return null
  }

  onSubmit() {
    this.submitted = true;
    if(!this.createAdminForm.valid){
      return;
    }
    else{
      const phoneNumber = this.createAdminForm.value.Phone;
      this.formatPhoneNumber(phoneNumber)

      const data = {
        FirstName: this.createAdminForm.value.FirstName,
        LastName: this.createAdminForm.value.LastName,
        Gender: this.createAdminForm.value.Gender,
        ContactNo: this.newFormatedNumber,
        JobTitle: this.createAdminForm.value.JobTitle,
        Email: this.createAdminForm.value.Email,
        DOB: this.date,
        Role: "ADMIN"
      }

      this.authService.postRequest('admin/add', data).then((res) => {
        if (res['status'] === true) {
          this.close();
          this.createAdminForm.reset();
          this.toastr.success(res['message']);
          this.updateAdminList.emit()
        }
        if (!res['status']) {
          this.toastr.error(res['message']);
        }
      });
    }
  }
}
