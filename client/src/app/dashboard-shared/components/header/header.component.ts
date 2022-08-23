import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Member } from 'src/app/_models/member';
import { HRUser } from 'src/app/_models/user';
import { LoginregisterService } from 'src/app/_services/loginregister.service';
import { MembersService } from 'src/app/_services/members.service';
import { take } from 'rxjs/operators';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();
  hrmember!: Member;
  hruser!: HRUser;
  
  constructor(public loginregisterService: LoginregisterService, private router: Router, private presence: PresenceService,
    private memberService: MembersService) { 
      this.loginregisterService.currentHRUser$.pipe(take(1)).subscribe(hruser => this.hruser = hruser!);
    }

  ngOnInit(): void {
    this.loadMember();
  }

  //each time we click, an event is emmitted
  toggleSidebar() {
    this.toggleSideBarForMe.emit();

    //make the graphs resize when the side bar is toggled
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300)
  }

  loadMember() {
    this.memberService.getMember(this.hruser.username).subscribe(memeber => this.hrmember = memeber);
  }


  logout() {
    //using the logout method declared in the loginregisterService
    this.loginregisterService.logout(); 
    this.presence.stopHubConnection();
    //redirecting the user to the home page 
    this.router.navigateByUrl('/');
  }

  deleteAccount (username: string) {
    if(confirm("Are you sure you want to delete your account?"))
    this.memberService.deleteAccount(username).subscribe(data => {
      console.log("THIS IS THE DATA: " + data);
      localStorage.removeItem("hruser");
      window.location.href = "/"
    })
    }


}
