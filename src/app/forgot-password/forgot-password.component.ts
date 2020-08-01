import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../router.animations';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  animations: [routerTransition()]
})
export class ForgotPasswordComponent implements OnInit {
  submitted: boolean;
  formSubmitted: boolean = false;
  error: boolean;
  userEmail: any;
  errorMessage: string;

  constructor(
    public translate: TranslateService,
    public router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.titleService.setTitle('HomeHealthPro | Forgot Password')

    this.submitted = false;
    this.error = false;
  }

  forgotForm = this.formBuilder.group({
    Email: ['',
        [
          Validators.required,
          Validators.email
        ]
    ]
  });

  onSubmit(){
    this.formSubmitted = true;

    if(!this.forgotForm.valid){
      return;
    }
    else{
      this.authService.postRequest('user/password/forgot',  this.forgotForm.value).then((res) => {
        if( res['status'] === true ){
          this.userEmail = this.forgotForm.value.Email;
          this.submitted = true;
          this.forgotForm.reset();
        }
        if( res['status'] === false ){
          this.toastr.error( res['message'] );
          this.forgotForm.reset();
        }
      });
    }
  }
}
