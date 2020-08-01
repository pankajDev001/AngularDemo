import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import {FormGroup, FormArray, FormBuilder, Validators} from '@angular/forms';
import {routerTransition} from '../../router.animations';
import {CommonService} from '../../services/common.service';

@Component({
  selector: 'app-user-fee-settings',
  templateUrl: './user-fee-settings.component.html',
  styleUrls: ['./user-fee-settings.component.scss'],
  animations: [routerTransition()]
})
export class UserFeeSettingsComponent implements OnInit {
  dtOptions: any = {};
  scrollbarOptions: any = {};
  categoryList: any = [];
  dtTrigger = new Subject();
  categoryForm: FormGroup;
  categories: FormArray;
  cat: any;
  isEditPermission:any= false;
  isDeletePermission:any = false;
  submitted: boolean = false;
  constructor(
    private titleService: Title,
    private authService: AuthService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private commonService: CommonService

  ) { }

  ngOnInit() {
    this.titleService.setTitle('HomeHealthPro | User Fee Settings');

    this.dtOptions = {
      paging: false,
      ordering: false,
      info: false,
      responsive: false,
      search: false,
    };

    this.scrollbarOptions = {
      axis: 'x',
      theme: 'healthPro-scrollbar',
    };

    this.authService.postRequest('category/list', '').then((res) => {
      if (res['status']) {
        this.categoryList = res['data'];
        for (let i = 0; i < this.categoryList.length; i++) {
          this.loadCategories(this.categoryList[i]);
        }
        this.dtTrigger.next();
      }
      if (!res['status']) {
        this.toastr.error(res['message']);
      }
    });
    this.categoryForm = this.formBuilder.group({
      categories: this.formBuilder.array([])
    });


    this.commonService.getPermission('/Category Fee/edit').then(res => {
      if (res)
        this.isEditPermission = true;
    });

  }

  categoryGroup(data){
    return this.formBuilder.group({
      categoryId : [data ? data.categoryId : ''],
      categoryLabel : [data ? data.category : ''],
      evaluationMin: [data ? data.evaluationMin : '',[Validators.required]],
      evaluationMax: [data ? data.evaluationMax : '', [Validators.required, Validators.min(data ? data.evaluationMin : null)]],
      dischargeMin: [data ? data.dischargeMin : '',[Validators.required]],
      dischargeMax: [ data ? data.dischargeMax : '', [Validators.required, Validators.min(data ? data.dischargeMin : null)]],
      treatmentVisitMin: [data ? data.treatmentVisitMin : '',[Validators.required]],
      treatmentVisitMax: [data ? data.treatmentVisitMax : '' , [Validators.required, Validators.min(data ? data.treatmentVisitMin : null)]]
    });
  }

  loadCategories(data){
    this.categoriesArray.push(this.categoryGroup(data));
  }

  get categoriesArray(){
    return <FormArray>this.categoryForm.get('categories');
  }

  getControls() {
    return (this.categoryForm.get('categories') as FormArray).controls;
  }

  checkValidation(type,data){

    if(type == 'evaluation') {

    }

  }

  setValidation(type,i){

    if(type == 'evaluation') {
      let val = parseFloat((<FormArray>this.categoryForm.get('categories')).controls[i]['controls']['evaluationMin'].value);
      (<FormArray>this.categoryForm.get('categories')).controls[i]['controls']['evaluationMax'].setValidators([Validators.required,Validators.min(val)]);
      (<FormArray>this.categoryForm.get('categories')).controls[i]['controls']['evaluationMax'].updateValueAndValidity();
    } else if(type == 'discharge') {
      let val = parseFloat((<FormArray>this.categoryForm.get('categories')).controls[i]['controls']['dischargeMin'].value);
      (<FormArray>this.categoryForm.get('categories')).controls[i]['controls']['dischargeMax'].setValidators([Validators.required,Validators.min(val)]);
      (<FormArray>this.categoryForm.get('categories')).controls[i]['controls']['dischargeMax'].updateValueAndValidity();
    } else if( type == 'treatmentVisit') {
      let val = parseFloat((<FormArray>this.categoryForm.get('categories')).controls[i]['controls']['treatmentVisitMin'].value);
      (<FormArray>this.categoryForm.get('categories')).controls[i]['controls']['treatmentVisitMax'].setValidators([Validators.required,Validators.min(val)]);
      (<FormArray>this.categoryForm.get('categories')).controls[i]['controls']['treatmentVisitMax'].updateValueAndValidity();
    }
  }

  updateFee(){
    this.submitted = true;
   this.categoryForm.markAllAsTouched();
    if(!this.categoryForm.valid) {
      return;
      
    }else{
      let val = this.categoryForm.value;

      val['categories'].forEach(item => {
        item.evaluationMin = parseFloat(item.evaluationMin);
        item.evaluationMax = parseFloat(item.evaluationMax);
        item.dischargeMin = parseFloat(item.dischargeMin);
        item.dischargeMax = parseFloat(item.dischargeMax);
        item.treatmentVisitMin = parseFloat(item.treatmentVisitMin);
        item.treatmentVisitMax = parseFloat(item.treatmentVisitMax);
      })


      this.authService.updateRequest('category/update', {CategoryFeeList: val['categories']}).then((res) => {
        if (res['status']) {
          this.toastr.success(res['message']);
        }
        if (!res['status']) {
          this.toastr.error(res['message']);
        }
      });

    }
  }
}
