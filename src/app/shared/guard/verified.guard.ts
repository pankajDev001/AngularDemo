import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerifiedGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(){

    if( localStorage.getItem('isVerified') ) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
