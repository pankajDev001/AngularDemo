import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { CommonService } from 'src/app/services/common.service';
import {SidebarMenus, SidebarMenusList} from '../../../shared/models/sidebar';
import {AuthService} from '../../../services/auth.service';
import { MalihuScrollbarService } from 'ngx-malihu-scrollbar';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  isActive: boolean;
  collapsed: boolean;
  showMenu: string;
  pushRightClass: string;
  user: any;
  contentUrl = environment.host_url;
  activeUrl = [];
  visible: any = [];

  @Output() collapsedEvent = new EventEmitter<boolean>();

  constructor(
    private translate: TranslateService,
    public router: Router,
    private commonService: CommonService,
    private authService: AuthService,
    private mScrollbarService: MalihuScrollbarService
  ) {

    this.router.events.subscribe(val => {

      if(val instanceof NavigationEnd){
        this.activeUrl = val.url.split('/');
      }

      if (
        val instanceof NavigationEnd &&
        window.innerWidth <= 992 &&
        this.isToggled()
      ) {
        this.toggleSidebar();
      }
    });
    var userDetails =  JSON.parse(localStorage.getItem('user'));

    // Update Profile Image After CROP.
    this.commonService.shareDataSubject.subscribe((data) => {
      this.user.profileImage = data;
      var user = {
        ...userDetails,
        profileImage: data
      }
      localStorage.setItem('user', JSON.stringify(user));
    });

    if(userDetails.role == 'SUPER_ADMIN'){
      SidebarMenusList.forEach(item => {
        this.visible[item] = true;
      });
    }
  }

  ngOnInit() {
    this.mScrollbarService.initScrollbar(document.getElementById('sidebar'), { axis: 'y', theme: 'healthPro-scrollbar' });
    this.isActive = false;
    this.collapsed = false;
    this.showMenu = '';
    this.pushRightClass = 'push-right';
    this.user = JSON.parse(localStorage.getItem('user'));

    this.setPermission(this.user);
  }

  eventCalled() {
    this.isActive = !this.isActive;
  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
    this.collapsedEvent.emit(this.collapsed);
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

  changeLang(language: string) {
    this.translate.use(language);
  }

  setPermission(userDetails){

    this.authService.postRequest('admin/permission/get', {userId: userDetails.userId}).then((res) => {

      if (res['data'].length > 0) {
        let modules = res['data'];
        let url;

        SidebarMenusList.forEach(item => {
          this.visible[item] = false;
          url = SidebarMenus[item].split('/');
          const check_url = url ? url[1].replace(' ', '').toLowerCase() : '';
          const module = modules.filter(item => item.moduleName.replace(' ', '').toLowerCase() == check_url);

          switch (item) {
            case 'DASHBOARD':
              if (url[2] === 'list')
                this.visible[item] = SidebarMenus[item] == '/dashboard/list' && module[0].isView;
              break;
            case 'CLINICIANS_LIST':
              if (url[2] === 'list')
                this.visible[item] = SidebarMenus[item] == '/clinicians/list' && module[0].isView;
              break;
            case 'AGENCIES_LIST':
              if (url[2] === 'list')
                this.visible[item] = SidebarMenus[item] == '/agencies/list' && module[0].isView;
              break;

            case 'PATIENTS_LIST':
              if (url[2] === 'list')
                this.visible[item] = SidebarMenus[item] == '/patients/list' && module[0].isView;
              break;

            case 'VISITS_LIST':
              if (url[2] === 'list')
                this.visible[item] = SidebarMenus[item] == '/Scheduled Visits/list' && module[0].isView;
              break;

            case 'ADMIN_USERS_LIST':
              if (url[2] === 'list')
                this.visible[item] = SidebarMenus[item] == '/Admin Users/list' && module[0].isView;
              break;

            case 'PAYEMENT_REVENUE_LIST':
              if (url[2] === 'list')
                this.visible[item] = SidebarMenus[item] == '/Payment Revenue/list' && module[0].isView;
              break;

            case 'CATEGORY_FEE_LIST':
              if (url[2] === 'list' && module.length > 0)
                this.visible[item] = SidebarMenus[item] == '/Category Fee/list' && module[0].isView;
              break;
          }
        });
      }
    });
  }
}
