import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { HRUser } from 'src/app/_models/user';
import { LoginregisterService } from 'src/app/_services/loginregister.service';
import { MembersService } from 'src/app/_services/members.service';
import { take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserParams } from 'src/app/_models/userParams';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})

export class ProfileEditComponent implements OnInit {
  //we wanto to refresh the form after we press the save button
  //editForm is the name given to the form in the html document 
  @ViewChild('editForm') editForm!: NgForm;
  hrmember!: Member;
  hrmembers!: Member[];
  hruser!: HRUser;
  userParams!: UserParams;

  //for preventing the user to close the page/go to another page on Google 
  //after he typed some changes to the profile
  //HostListener helps us access the browser events 
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true; 
    }
  }

  constructor(private loginRegisterService: LoginregisterService, 
    private memberService: MembersService, private toastr: ToastrService, private route: ActivatedRoute) {
    //we want to populate the user object with data from our current user 
    this.loginRegisterService.currentHRUser$.pipe(take(1)).subscribe(hruser => this.hruser = hruser!);
    this.userParams = this.memberService.getUserParams();
   }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() {
    this.memberService.getMember(this.hruser.username).subscribe(memeber => this.hrmember = memeber);
  }

  loadMembers() {
    this.memberService.getMembers(this.userParams).subscribe(members => this.hrmembers = members);
  }

  updateMember() {
    this.memberService.updateMember(this.hrmember).subscribe(() =>{
      this.toastr.success("Profile updated succesfully!");
      this.editForm.reset(this.hrmember);
    })
  }

  deleteAccount (username: string) {
    this.memberService.deleteAccount(username).subscribe(data => {
      console.log("THIS IS THE DATA: " + data)
    })
    }
}

