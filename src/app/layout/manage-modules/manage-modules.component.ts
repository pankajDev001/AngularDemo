import {Component, OnInit, Renderer} from '@angular/core';
import { routerTransition } from '../../router.animations';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../../services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-manage-modules',
  templateUrl: './manage-modules.component.html',
  styleUrls: ['./manage-modules.component.scss'],
  animations: [routerTransition()]
})
export class ManageModulesComponent implements OnInit {
  userName = '';
  scrollbarOptions: any = {};
  adminList: any = [];
  modules: any = [];
  selectedUser: any;
  searchKey: any = ''
  constructor(
    private titleService: Title,
    private modalService: NgbModal,
    private authService: AuthService,
    private toastr: ToastrService,
    private renderer: Renderer
  ) { }

  ngOnInit() {
    this.scrollbarOptions = {
      axis: 'y',
      theme: 'healthPro-scrollbar',
    };


    this.authService.postRequest('admin/list', {}, 1).then((res) => {

      if(res)
      {
        this.adminList = res['data'];
        if(this.adminList.length > 0){
          this.selectedUser = this.adminList[0];
          this.getAdminModules(this.adminList[0]);
        }
      }
    });
  }


  getAdminModules(item) {
    this.userName = item.fullName;
    this.selectedUser = item;
    this.authService.postRequest('admin/permission/get', {userId: item.userId}).then((res) => {
      if(res) {
        this.modules = res['data'];
      }
    });
  }

  changeStatus(type, index, event) {
    if( type == 'isView')
      this.modules[index].isView = event.target.checked;
    else if( type == 'isEdit')
      this.modules[index].isEdit = event.target.checked;
    else if( type == 'isDelete')
      this.modules[index].isDelete = event.target.checked;
  }

  updateModules(){

    let data = {
      UserId: this.selectedUser.userId,
      ModuleMappingDetails: this.modules
    }
    this.authService.postRequest('admin/permission/set', data).then((res) => {
      if(res)
        this.toastr.success(res['message']);

    });
  }
}
