
import {Injectable} from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';

import {Observable, of} from 'rxjs';
import {Router} from "@angular/router";
import {catchError} from "rxjs/internal/operators";
import {ToastrService} from 'ngx-toastr';

@Injectable()
export class InterceptService implements HttpInterceptor {

    constructor(private router: Router,private toastr : ToastrService) {
    }


    /**
     * intercept all XHR request
     * @param request
     * @param next
     * @returns {Observable<A>}
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        /**
         * continues request execution
         */
        return next.handle(request).pipe(catchError((error, caught) => {
            this.handleAuthError(error);
            return of(error);
        }) as any);
    }


    /**
     * manage errors
     * @param err
     * @returns {any}
     */
    private handleAuthError(err: HttpErrorResponse): Observable<any> {
        let self = this;
      if (err.status === 401) {
            this.toastr.error('Unauthorrized','Error!');
            localStorage.clear();
            setTimeout(function () {
                self.router.navigate(['/login']);

            }, 1000);
            return of(err.message);
        }
        throw err;
    }
}
