import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { HRUser } from 'src/app/_models/user';
import { LoginregisterService } from 'src/app/_services/loginregister.service';
import { MembersService } from 'src/app/_services/members.service';
import { take } from 'rxjs/operators';
import { PaginatedResult } from 'src/app/_models/pagination';
import { UserParams } from 'src/app/_models/userParams';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  hrmembers!: PaginatedResult<Member[]>;
  hrmember!: Member;
  hruser!: HRUser;
  userParams!: UserParams;

  constructor(public loginregisterService:LoginregisterService, private memberService: MembersService) {
    this.loginregisterService.currentHRUser$.pipe(take(1)).subscribe(hruser => {
    this.hruser = hruser!
    this.userParams = new UserParams(hruser!);
  });

   }

  ngOnInit(): void {
    this.loadMember();
  }

  loadHRMembers() {
    this.memberService.getMembers(this.userParams).subscribe(members => {
      this.hrmembers = members;
    })
  }

  loadMember() {
    this.memberService.getMember(this.hruser.username).subscribe(memeber => this.hrmember = memeber);
  }
}
