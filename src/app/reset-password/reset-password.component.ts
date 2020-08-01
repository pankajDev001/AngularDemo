import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../router.animations';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  animations: [routerTransition()]
})
export class ResetPasswordComponent implements OnInit {
  submitted: boolean = false;
  Email: any;
  EmailToken: any;
  fieldTextType: boolean;
  fieldTextType2: boolean;
  constructor(
    public translate: TranslateService,
    public router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private titleService: Title
  ) {
      this.route.params.subscribe( params => this.Email = params.Email );
      this.route.params.subscribe( params => this.EmailToken = params.EmailToken );
  }

  ngOnInit() {
    this.titleService.setTitle('HomeHealthPro | Reset Password')
  }

  resetForm = this.formBuilder.group({
    Password: ['',
      [
        Validators.required,
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d.*)(?=.*\\W.*)[a-zA-Z0-9\\S]{8,}$')
      ]
    ],
    ConfirmPassword: ['',
      [
        Validators.required
      ]
    ],
    Email: this.Email,
    EmailToken: this.EmailToken
  },
  {
    validator: this.commonService.matchingPasswords('Password', 'ConfirmPassword')
  });

  onSubmit(){
    this.submitted = true;
    if(!this.resetForm.valid){
      return;
    }
    else{
      const data = {
        Email: this.Email,
        EmailToken: this.EmailToken,
        Password: this.resetForm.value.Password,
        ConfirmPassword: this.resetForm.value.ConfirmPassword
      }

      this.authService.postRequest('user/password/reset', data).then((res) => {
        if( res['status'] ){
          this.toastr.success(res['message']);
          this.router.navigate(['/login']);
          this.resetForm.reset();
        }
        if( res['status'] === false ){
          this.toastr.error( res['message'] );
          this.resetForm.reset();
        }
      });
    }
  }
  onNewPassword() {
    this.fieldTextType = !this.fieldTextType;
  }
  onConfirmPassword() {
    this.fieldTextType2 = !this.fieldTextType2;
  }
}
