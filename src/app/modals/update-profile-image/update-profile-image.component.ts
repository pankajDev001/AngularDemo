import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-update-profile-image',
  templateUrl: './update-profile-image.component.html',
  styleUrls: ['./update-profile-image.component.scss']
})
export class UpdateProfileImageComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  newCroppedImage: any;
  uploadedImage: any;
  loading: boolean = true;
  contentUrl = environment.host_url;

  @Input() public selectedProfileImage;
  @Output() uploadedProfileImage = new EventEmitter();
  @Output() updateSidebarProfileImage = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.imageChangedEvent = this.selectedProfileImage.event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    fetch(this.croppedImage)
    .then(res => res.blob())
    .then(blob => {
      this.newCroppedImage = new File([blob], this.imageChangedEvent.target.files[0].name, { type: this.imageChangedEvent.target.files[0].type })
    })
  }

  imageLoaded() {
    this.loading = false;
  }
  cropperReady() {}

  loadImageFailed() {}

  uploadFile(){
    const formData = new FormData();
    formData.append('UserId', this.selectedProfileImage.userId);
    formData.append('File', this.newCroppedImage);
    formData.append('DocumentType', 'Profile Image');
    formData.append('DocumentName', 'Profile Image');
    
    this.authService.fileRequest('file/upload', formData).then( (res) => {
      if( res['status'] ){
        this.toastr.success( res['message'] );
        this.uploadedImage = res['data'];
        this.modalService.dismissAll();
        this.uploadedProfileImage.emit(this.uploadedImage);
        this.updateSidebarProfileImage.emit(this.uploadedImage);
      }
      if( !res['status'] ){
        this.toastr.error( res['message'] );
      }
    }); 
  }

  close(){
    this.modalService.dismissAll();
  }
}
