import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../router.animations';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [routerTransition()]
})
export class LoginComponent implements OnInit {
  submitted: boolean = false;
  fieldTextType: boolean;
  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private titleService : Title
  ) {
    document.body.className = "";
  }

  ngOnInit() {
      this.titleService.setTitle('HomeHealthPro | Login');

      if( localStorage.getItem('isVerified') && localStorage.getItem('isLoggedIn') && localStorage.getItem('userId') !== null ){
        this.router.navigate(['/dashboard']);
        return true;
      }
      this.router.navigate(['/login']);
      return false;
  }

  loginForm = this.formBuilder.group({
    Email: ['',
      [
        Validators.required,
        Validators.email,
        Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$')
      ]
    ],
    Password: ['', Validators.required]
  });

  onSubmit(){
    this.submitted = true;
    if(!this.loginForm.valid){
      return;
    }
    else{
      const data = {
        Email: this.loginForm.value.Email,
        Password: this.loginForm.value.Password,
        IsWebLogin: true
      }
      this.authService.postRequest('auth/token', data).then((res) => {
        if( res['status'] ){
          this.toastr.success( res['message'] );
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userId', res['userId']);
          this.router.navigate(['/verify-otp']);
          this.submitted = false;
          this.loginForm.reset();
        }
        if( res['status'] === false ){
          this.toastr.error(res['message']);
          this.loginForm.reset();
        }
      })
    }
  }
  onPassword() {
    this.fieldTextType = !this.fieldTextType;
  }
}
