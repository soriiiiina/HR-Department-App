import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { HRUser } from 'src/app/_models/user';
import { LoginregisterService } from 'src/app/_services/loginregister.service';
import { MembersService } from 'src/app/_services/members.service';
import { take } from 'rxjs/operators';
import { Photo } from 'src/app/_models/photo';

@Component({
  selector: 'app-member-photo-card',
  templateUrl: './member-photo-card.component.html',
  styleUrls: ['./member-photo-card.component.css']
})
export class MemberPhotoCardComponent implements OnInit {
  //recieving the member from the parent component 
  // @Input() member: Member | undefined;
  hrmember!: Member;
  hruser!: HRUser;

  constructor(private loginRegisterService: LoginregisterService, 
    private memberService: MembersService) {
    //we want to populate the user object with data from our current user 
    this.loginRegisterService.currentHRUser$.pipe(take(1)).subscribe(hruser => this.hruser = hruser!);
   }

   setMainPhoto(photo : Photo) {
    this.memberService.setMainPhoto(photo.id).subscribe(() => {
      this.hruser.photoUrl = photo.url;
      //updating the photo inside local storage 
      this.loginRegisterService.setCurrentHRUser(this.hruser);
      //updating the member 
      this.hrmember.photoUrl = photo.url;
      //loop through the photos 
      this.hrmember.photo.forEach(p => {
        if(p.isMain) p.isMain = false;
        if(p.id === photo.id) p.isMain = true;
      })

    })
  }

  deletePhoto(photoId: number) {
    this.memberService.deletePhoto(photoId).subscribe(() => {
      //returning an array of all the photos that don't have the same id as the deleted photo
      this.hrmember.photo = this.hrmember.photo.filter(x => x.id !== photoId);
    })
  }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    this.memberService.getMember(this.hruser.username).subscribe(memeber => this.hrmember = memeber);

  }

}
