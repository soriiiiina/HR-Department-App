import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { HRUser } from 'src/app/_models/user';
import { LoginregisterService } from 'src/app/_services/loginregister.service';
import { MembersService } from 'src/app/_services/members.service';
import { take } from 'rxjs/operators';
import { FileUploader} from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { GridAlignRowsDirective } from '@angular/flex-layout';
import { Photo } from 'src/app/_models/photo';
import { UserParams } from 'src/app/_models/userParams';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  //recieving the member from the parent component 
  // @Input() member: Member | undefined;
  hrmember!: Member;
  hrmembers!: Member[];
  hruser!: HRUser;
  userParams!: UserParams;

  //for the file uploader
  uploader!: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;

  constructor(private loginRegisterService: LoginregisterService, 
    private memberService: MembersService) {
    //we want to populate the user object with data from our current user 
    this.loginRegisterService.currentHRUser$.pipe(take(1)).subscribe(hruser => this.hruser = hruser!);
    this.userParams = this.memberService.getUserParams();
  }
 
    
  ngOnInit(): void {
    this.loadMember();
    this.initializeUploader();
    this.loadMembers();
  }

  loadMember() {
    this.memberService.getMember(this.hruser.username).subscribe(memeber => this.hrmember = memeber);
  }

  loadMembers() {
    this.memberService.setUserParams(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe(response => {
      this.hrmembers = response.result;
    })
  }



  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'hrusers/add-photo',
      authToken: 'Bearer ' + this.hruser.userToken,
      isHTML5: true, 
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 *1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if(response) {
        const photo: Photo = JSON.parse(response);
        //adding the photo/s into the photo array 
        this.hrmember.photo.push(photo);
        if(photo.isMain) {
          //updating the photo everywhere 
          this.hruser.photoUrl = photo.url;
          this.hrmember.photoUrl = photo.url;
          this.loginRegisterService.setCurrentHRUser(this.hruser);
        }
      }
    }
  }

}
