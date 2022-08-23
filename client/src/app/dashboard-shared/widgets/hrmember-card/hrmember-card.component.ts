import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { LoginregisterService } from 'src/app/_services/loginregister.service';
import { MembersService } from 'src/app/_services/members.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-hrmember-card',
  templateUrl: './hrmember-card.component.html',
  styleUrls: ['./hrmember-card.component.css']
})
export class HrmemberCardComponent implements OnInit {

  //we need to get all the users from the parent component (hrmembers-list)
  @Input() hrmember!: Member; 

  
  constructor(private memberService: MembersService, private toastr: ToastrService, 
    private loginRegisterService: LoginregisterService, public presence: PresenceService) {
   }

  ngOnInit(): void {
  }

  addLike(member: Member) {
    this.memberService.addLike(member.username).subscribe(() => {
      this.toastr.success('Done! You showed some appreciation to ' + member.username);
    })
  }

}
