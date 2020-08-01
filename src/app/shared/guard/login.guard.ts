import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {
    constructor(private router: Router) { }
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        if (localStorage.getItem('user'))  {
            // logged in so return true
          if(JSON.parse(localStorage.getItem('user')).role == 'SUPER_ADMIN' || JSON.parse(localStorage.getItem('user')).role == 'ADMIN')
          this.router.navigate(['/dashboard']);
          else
            this.router.navigate(['agency/dashboard']);

        }else {
            return true;
        }
    }
}
