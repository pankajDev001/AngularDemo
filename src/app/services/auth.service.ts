import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.api_url;
  currentUrl: any;
  previousUrl: any;
  token = localStorage.getItem('token') == null ? '' : localStorage.getItem('token');
  config = {
    headers: {
      'Authorization': 'Bearer ' + this.token,
      'Content-Type': 'application/json'
    }
  };

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.currentUrl = this.router.url;

    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
    });
  }

  postRequest(api_url, data, type = null) {
    return new Promise((resolve, reject) => {
      this.config.headers.Authorization = localStorage.getItem('token') == null ? '' : 'Bearer ' + localStorage.getItem('token');
      this.config.headers['Content-Type']  = type ?  'application/x-www-form-urlencoded' : 'application/json';
      this.http.post(this.baseUrl + api_url, data, this.config).subscribe((data):any => {
        resolve(data);
      }, err => {
        this.toastr.error(err.error.message);
        reject(err.error.error);
      });
    });
  }

  postRequestFile(api_url, data) {
    return new Promise((resolve, reject) => {
      const configForFile={
        headers:{
          'Authorization' : localStorage.getItem('token') == null ? '' : 'Bearer ' + localStorage.getItem('token'),
          'Content-Type':  'application/x-www-form-urlencoded'
        }
      };
      this.http.post(this.baseUrl + api_url, data,{
        headers:configForFile.headers,
        responseType:'arraybuffer'
      } ).subscribe((data):any => {
        resolve(data);
      }, err => {
       // this.toastr.error(err.error.message);
        reject(err.error.error);
      });
    });
  }

  deleteRequest(api_url, data) {
    const options = {
      headers: new HttpHeaders(this.config.headers),
      body: data
    }
    return new Promise((resolve, reject) => {
      this.config.headers.Authorization = localStorage.getItem('token') == null ? '' : 'Bearer ' + localStorage.getItem('token');

      this.http.delete(this.baseUrl + api_url, options).subscribe(data => {
        resolve(data);
      }, err => {
        this.toastr.error(err.error.message);
        reject(err.error.error);
      });
    });
  }

  updateRequest(api_url, data) {
    return new Promise((resolve, reject) => {
      this.config.headers.Authorization = localStorage.getItem('token') == null ? '' : 'Bearer ' + localStorage.getItem('token');

      this.http.put(this.baseUrl + api_url, data, this.config).subscribe(data => {
        resolve(data);
      }, err => {
        this.toastr.error(err.error.message);
        reject(err.error.error);
      });
    });
  }

  getRequest(api_url) {
    return new Promise((resolve, reject) => {
      this.config.headers.Authorization = localStorage.getItem('token') == null ? '' : 'Bearer ' + localStorage.getItem('token');

      this.http.get(this.baseUrl + api_url, this.config).subscribe(data => {
        resolve(data)
      }, err => {
        this.toastr.error(err.error.message);
        reject(err.error.error);
      })
    });
  }

  fileRequest(api_url, data) {
    return new Promise((resolve, reject) => {
      this.config.headers.Authorization = localStorage.getItem('token') == null ? '' : 'Bearer ' + localStorage.getItem('token');

      this.http.post(this.baseUrl + api_url, data, {
        headers: {
          'Authorization': 'Bearer ' + this.token
        }
      }).subscribe(data => {
        resolve(data);
      }, err => {
        this.toastr.error(err.error.message);
        reject(err.error.error);
      });
    });
  }


  getNearbyZipcodes(code){
    return new Promise((resolve, reject) => {
      this.http.get('https://www.zipcodeapi.com/rest/8Xraj6j0sd1XUegnY0z2vukFSRD3ymfBoffrDuWpwmk9S3IN4AAEsd5H59c43IHO/radius.json/99524/5/km').subscribe(data => {
        resolve(data)
      }, err => {
        this.toastr.error(err.error.message);
        reject(err.error.error);
      });
    });
  }
}
