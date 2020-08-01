import {EventEmitter, Injectable} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {BehaviorSubject, Subject} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  shareDataSubject = new Subject<any>();
  public newFormatedNumber;
  public newFormatedDate;
  notifyCount: EventEmitter<number> = new EventEmitter();

  constructor(private authService: AuthService) {
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }

  emitNavChangeEvent(number) {
    this.notifyCount.emit(number);
  }
  getNavChangeEmitter() {
    return this.notifyCount;
  }

  public setScope(type,data: any): void {
    window.localStorage.setItem(type,data);
  }

  public getScope(type) {

    return window.localStorage.getItem(type);
  }

  sendDataToOtherComponent(somedata) {
    this.shareDataSubject.next(somedata);
  }

  public noWhitespaceValidator(control: FormControl) {

    let isWhitespace = (control.value || '').trim().length === 0;
    ////console.log(isWhitespace);
    let isValid = !isWhitespace;
    return isValid ? null : {'required': true}
  }

  formatPhoneNumber(phoneNumberString) {
    var match = phoneNumberString.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return this.newFormatedNumber = match[1] + '-' + match[2] + '-' + match[3]
    }
  }

  deformatPhoneNumber(phoneNumberString) {
    var match = phoneNumberString.match(/^(\d{3})-(\d{3})-(\d{4})$/)
    if (match) {
      return this.newFormatedNumber = match[1] + match[2] + match[3]
    }
  }

  formatDate(date, obj=null) {
    var date = date.toString().substring(0, 10).split('/');
    if (obj) {
      var dateObj = {year: parseInt(date[0]), month: parseInt(date[1]), day: parseInt(date[2])}
      return dateObj;
    }
    else {
      date = date[1] + '-' + date[2] + '-' + date[0];
      return date;
    }
  }

  getPermission(route) {
    return new Promise((resolve, reject) => {
      let user = JSON.parse(localStorage.getItem('user'));
      let url = route.split('/');
      let module = [];

      if (user && user.role == 'SUPER_ADMIN')
        resolve(true);
      else if (user && user.role == 'ADMIN') {
        this.authService.postRequest('admin/permission/get', {userId: user.userId}).then((res) => {

          if (res['data'].length > 0) {
            let modules = res['data'];
            let check_url = url ? url[1].replace(' ','').toLowerCase() : '';

            module = user ? modules.filter(item => item.moduleName.replace(' ','').toLowerCase() == check_url) : [];
            switch (url[1]) {

              case 'dashboard':
                if (url[2] == 'list')
                  resolve(route == '/dashboard/list' && module[0].isView);
                else if (url[2] == 'edit')
                  resolve(route == '/dashboard/edit' && module[0].isEdit);
                else if (url[2] == 'delete')
                  resolve(route == '/dashboard/delete' && module[0].isDelete);
                break;

              case 'clinicians':
                if (url[2] == 'list')
                  resolve(route == '/clinicians/list' && module[0].isView);
                else if (url[2] == 'edit')
                  resolve(route == '/clinicians/edit' && module[0].isEdit);
                else if (url[2] == 'delete')
                  resolve(route == '/clinicians/delete' && module[0].isDelete);
                break;

              case 'agencies':
                if (url[2] == 'list')
                  resolve(route == '/agencies/list' && module[0].isView);
                else if (url[2] == 'edit')
                  resolve(route == '/agencies/edit' && module[0].isEdit);
                else if (url[2] == 'delete')
                  resolve(route == '/agencies/delete' && module[0].isDelete);
                break;

              case 'patients':
                if (url[2] == 'list')
                  resolve(route == '/patients/list' && module[0].isView);
                else if (url[2] == 'edit')
                  resolve(route == '/patients/edit' && module[0].isEdit);

                break;

              case 'Scheduled Visits':
                if (url[2] == 'list')
                  resolve(route == '/Scheduled Visits/list' && module[0].isView);
                else if (url[2] == 'edit')
                  resolve(route == '/Scheduled Visits/edit' && module[0].isEdit);
                break;

              case 'Admin Users':
                if (url[2] == 'list')
                  resolve(route == '/Admin Users/list' && module[0].isView);
                else if (url[2] == 'edit')
                  resolve(route == '/Admin Users/edit' && module[0].isEdit);
                else if (url[2] == 'delete')
                  resolve(route == '/Admin Users/delete' && module[0].isDelete);
                break;

              case 'Category Fee':
                if (url[2] == 'list')
                  resolve(route == '/Category Fee/list' && module[0].isView);
                else if (url[2] == 'edit')
                  resolve(route == '/Category Fee/edit' && module[0].isEdit);
                break;


              case 'Payment Revenue':
                if (url[2] == 'list')
                  resolve(route == '/Payment Revenue/list' && module[0].isView);
                else if (url[2] == 'edit')
                  resolve(route == '/Payment Revenue/edit' && module[0].isEdit);
                break;

              default:
                resolve(false);
            }
          }
        });

      }else if(user.role === 'AGENCY') {
        this.authService.postRequest('admin/permission/get', {Role: 'AGENCY'}).then((res) => {

          if (res['data'].length > 0) {
            let modules = res['data'];
            let check_url = url ? url[1].replace(' ', '').toLowerCase() : '';
            module = user ? modules.filter(item => item.moduleName.replace(' ', '').toLowerCase() == check_url) : [];
            switch (url[1]) {

              case 'dashboard':
                if (url[2] == 'agency')
                  resolve(route == '/dashboard/agency' && module[0].isView);
                else if (url[2] == 'edit')
                  resolve(route == '/dashboard/edit' && module[0].isEdit);
                else if (url[2] == 'delete')
                  resolve(route == '/dashboard/delete' && module[0].isDelete);
                break;

              case 'clinicians':
                if (url[2] == 'list')
                  resolve(route == '/clinicians/list' && module[0].isView);
                else if (url[2] == 'edit')
                  resolve(route == '/clinicians/edit' && module[0].isEdit);
                else if (url[2] == 'delete')
                  resolve(route == '/clinicians/delete' && module[0].isDelete);
                break;

              case 'patients':
                if (url[2] == 'list')
                  resolve(route == '/patients/list' && module[0].isView);
                else if (url[2] == 'edit')
                  resolve(route == '/patients/edit' && module[0].isEdit);
                break;

              case 'Scheduled Visits':
                if (url[2] == 'list')
                  resolve(route == '/Scheduled Visits/list' && module[0].isView);
                else if (url[2] == 'edit')
                  resolve(route == '/Scheduled Visits/edit' && module[0].isEdit);
                break;

              case 'Payment Revenue':
                if (url[2] == 'list')
                  resolve(route == '/Payment Revenue/list' && module[0].isView);
                else if (url[2] == 'edit')
                  resolve(route == '/Payment Revenue/edit' && module[0].isEdit);
                break;
              default:
                resolve(false);
            }
          }
        });
      }
    });
  }
}
