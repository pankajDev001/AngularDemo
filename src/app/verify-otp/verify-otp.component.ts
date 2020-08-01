import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../router.animations';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import {CommonService} from '../services/common.service';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss'],
  animations: [routerTransition()]
})
export class VerifyOtpComponent implements OnInit {
  submitted: boolean = false;
  isEditPermission:any= false;

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private titleService: Title,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.titleService.setTitle('HomeHealthPro | Verify OTP')

    if( localStorage.getItem('isLoggedIn') ){
      if( localStorage.getItem('isVerified') ){
        this.router.navigate(['/dashboard']);
        return true;
      }
      this.router.navigate(['/verify-otp']);
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

  otpForm = this.formBuilder.group({
    Otp: ['',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        Validators.pattern('([0-9]{0,})')
      ]
    ]
  });

  onSubmit(){
    this.submitted = true;

    if(!this.otpForm.valid){
      return;
    }
    else{
      const data = {
        Otp: this.otpForm.value.Otp,
        UserId: localStorage.getItem('userId'),
        DeviceId: '',
        DeviceToken: '',
        DevicePlatform: 'web'
      }
      this.authService.postRequest('auth/otp/verify', data).then((res) => {
        if( res['status'] === true ){
          this.toastr.success( res['message'] );
          localStorage.setItem('isVerified', 'true');
          localStorage.setItem('token', res['token']);
          localStorage.setItem('user', JSON.stringify(res['user']) );
          let user = JSON.parse(localStorage.getItem('user'));

          if (user.role === "AGENCY") {
            this.router.navigate(['/agency/dashboard']);
          }

          this.commonService.getPermission('/dashboard/list').then(res => {
            if (res) {
              if (user.role === "SUPER_ADMIN" || user.role === "ADMIN") {
                this.router.navigate(['/dashboard']);
              }
              if (user.role === "AGENCY") {
                this.router.navigate(['/agency/dashboard']);
              }
            }else{
              this.router.navigate(['/my-account']);
            }
          });
          this.submitted = false;

          this.otpForm.reset();
        }
        if( res['status'] === false ){
          this.toastr.error( res['message'] );
          this.otpForm.reset();
        }
      });
    }
  }

  resendOTP(){
    const data = {
      UserId: localStorage.getItem('userId')
    }
    this.authService.postRequest('auth/otp/resend',  data).then((res) => {
      if( res['status'] === true ){
        this.toastr.success( res['message'] );
        this.otpForm.reset();
      }
      if( res['status'] === false ){
        this.toastr.success(res['message']);
        this.otpForm.reset();
      }
    })
    .catch((err) => {
      this.toastr.success(err);
    });
  }
}
