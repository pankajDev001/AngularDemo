import { Injectable } from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {CommonService} from '../../services/common.service';
import {ToastrService} from 'ngx-toastr';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private commonService: CommonService, private toastr : ToastrService) {}

  canActivate() {
    if( localStorage.getItem('isLoggedIn') ) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    if(route.data['url'] as Array<string>) {
       return this.commonService.getPermission(route.data['url'] as Array<string>).then(res => {
        if(res)
          return true;
        else
          this.toastr.error("No Permission");

      });
    }
  }
}
