import {Component, OnInit, ViewChild} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import {NgbModal, NgbModalOptions, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {VisitCliniciansComponent} from "../../../modals/visit-clinicians/visit-clinicians.component";
import {VisitDetailsComponent} from "../../../modals/visit-details/visit-details.component";
import * as signalR from "@aspnet/signalr";
import { HubConnection } from '@aspnet/signalr';
import {take} from "rxjs/operators";
import {CommonService} from "../../../services/common.service";
import Swal from 'sweetalert2';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public pushRightClass: string;
  modalRef: NgbModalRef;
  @ViewChild('content',{static: false}) myModal: any;
  Reason: any ;
  count: number = 0;
  notify_list: [];
  user = JSON.parse(localStorage.getItem('user'));
  
  private hubConnection: HubConnection;

  constructor(
    private translate: TranslateService,
    public router: Router,
    private authService: AuthService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) {
    this.router.events.subscribe(val => {
      if(val['url']){
        this.count = val['url'] != '/agency/dashboard' ? parseInt(localStorage.getItem('notificationCount')) : 0
      }
      if (
        val instanceof NavigationEnd &&
        window.innerWidth <= 992 &&
        this.isToggled()
      ) {

        this.toggleSidebar();
      }
    });
    

  }

  ngOnInit() {    

    this.pushRightClass = 'push-right';
  if(this.user.role === 'AGENCY'){
      console.log(this.user.role);
    this.hubConnection  = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Debug)
      .withUrl("http://3.22.84.196:81/notificationHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();

    // http://172.16.3.2:56865/api/values
    this.hubConnection.start().then(() => {
    }).catch(err => console.log(err));

   

    this.hubConnection.on("OnRequestRespondedByClinician", (title: string, body: string, type: string, extraDataJson: string) => {
      console.log(type,JSON.parse(extraDataJson));
      if(title && (this.user.role === 'AGENCY')){
        let item = JSON.parse(extraDataJson);
        item.type = type;
        item.toUserId = item.ToUserId;
        item.notificationId = item.NotificationId;
        item.extraDataJson = extraDataJson;
        this.count +=  1;
        localStorage.setItem('notificationCount',this.count.toString());

        this.toastr.success(item.Message, 'Request Responded By Clinician',{
          timeOut: 10000,
        }).onTap
          .pipe(take(1))
          .subscribe(() => {
            this.updateNotification(item)
          });
      }
    });
    this.hubConnection.on("OnNotesSubmittedByClinician", (title: string, body: string, type: string, extraDataJson: string) => {
      console.log(type,JSON.parse(extraDataJson));
      if(title && (this.user.role === 'AGENCY')){
        let item = JSON.parse(extraDataJson);
        item.type = type;
        item.toUserId = item.ToUserId;
        item.notificationId = item.NotificationId;
        item.extraDataJson = extraDataJson;
        this.count +=  1;
        localStorage.setItem('notificationCount',this.count.toString());

        this.toastr.success(item.Message, 'Notes Submitted',{
          timeOut: 10000
        }).onTap
          .pipe(take(1))
          .subscribe(() => {
            this.updateNotification(item)
          });
      }
    });

    this.hubConnection.on("OnVisitCancelledByClinician", (title: string, body: string, type: string, extraDataJson: string) => {
      console.log(type);
      if(title && (this.user.role === 'AGENCY')){
        let item = JSON.parse(extraDataJson);
        item.type = type;
        item.toUserId = item.ToUserId;
        item.notificationId = item.NotificationId;

        item.extraDataJson = extraDataJson;
        this.count +=  1;
        localStorage.setItem('notificationCount',this.count.toString());

        this.toastr.success(item.Message, 'Visit Cancelled',{
          timeOut: 10000,
        }).onTap
          .pipe(take(1))
          .subscribe(() => {
            this.updateNotification(item)
          });
      }
    });

    this.hubConnection.on("OnLoggedInFromOtherDevice", (userId: string, body: string ) => {
     let isVerified : String = localStorage.getItem('isVerified');
      if((this.user.userId ===  userId) && (isVerified === 'true')){       
        localStorage.clear();
        Swal.fire({
          title: 'Logged IN from other device !',
          text: "You will be logged out here as you have been logged in to system from other device.",
          icon: 'warning',
          showCancelButton: false,
          allowOutsideClick: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, logout it!'
        }).then((result) => {
          this.toastr.success('User successfully logged out.');
          this.router.navigate(['/home']);

        })
      }
    });

  }
}

  ngAfterViewInit(){
    this.commonService.notifyCount.subscribe(res =>{
       this.count = res;
    })
  }
  getNotificationsList(myDrop){

    if (myDrop.isOpen()) {
      myDrop.close();
    } else {
      myDrop.open();
      this.authService.postRequest('notification/list', {}, 0).then((res) => {
        if (res['status']) {
          this.notify_list = res['data'];

        }
      });
    }
  }

  updateNotification(item){
    this.authService.updateRequest('notification/update', { "notificationId": item.notificationId, "toUserId": item.toUserId, "isRead": true}).then((res) => {
      if (res['status']) {
        this.count > 0 ? this.count -= 1 : 0;
        localStorage.setItem('notificationCount',this.count.toString());
        let extraData = JSON.parse(item.extraDataJson);
        if(item.type == 'clinician-visit-request-accept' || item.type == 'clinician-visit-request-reject') {
          this.openCliniciansModal(extraData.VisitId);
        }

        if(item.type == 'clinician-notes-submitted'){
          this.openDetailModal(extraData.VisitId);
        }

        if(item.type == 'clinician-visit-cancel-request'){
          let ngbModalOptions: NgbModalOptions = {
            backdrop : 'static',
            keyboard : false,
            ariaLabelledBy: 'visit-details',
            centered: true,
            size: 'lg'
          };
          this.Reason = {title:item.title ? item.title : 'Visit Cancelled',reason:extraData.Reason,visitId: extraData.VisitId};

          this.modalService.open(this.myModal,ngbModalOptions);
        }
      }
    });
  }
  openDetailModal(visitId,type = 0){
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      ariaLabelledBy: 'visit-details',
      centered: true,
      size: 'lg'
    };
    this.modalRef = this.modalService.open(VisitDetailsComponent, ngbModalOptions);
    this.modalRef.componentInstance.visitId = visitId;
    this.modalRef.componentInstance.type = type == 1 ? 'notification' : 'normal';
  }

  openCliniciansModal(visitId){
    let ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false,
      ariaLabelledBy: 'visit-details',
      centered: true,
      size: 'lg'
    };
    this.modalRef = this.modalService.open(VisitCliniciansComponent, ngbModalOptions);
    this.modalRef.componentInstance.visitId = visitId;
    this.modalRef.componentInstance.updateScheduleVisitList.subscribe(res => {

    })

  }
  isToggled(): boolean {
    const dom: Element = document.querySelector('body');
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.pushRightClass);
  }

  rltAndLtr() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle('rtl');
  }

  onLoggedout() {
    document.body.className = "";
    this.authService.getRequest('user/logout').then((res) => {
      if( res['status'] ){
        this.toastr.success(res['message']);
        localStorage.clear();
        this.router.navigate(['/home']);
      }
      if( res['status'] === false ){
        this.toastr.error( res['message'] );
        localStorage.clear();
        this.router.navigate(['/login']);
      }
    })
  }

  changeLang(language: string) {
    this.translate.use(language);
  }


  gotToVisit(){
    this.openDetailModal(this.Reason.visitId,0);
  }
}
