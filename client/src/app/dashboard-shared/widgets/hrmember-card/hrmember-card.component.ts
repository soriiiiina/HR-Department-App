import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/_models/member';
import { HRUser } from 'src/app/_models/user';
import { LoginregisterService } from 'src/app/_services/loginregister.service';
import { MembersService } from 'src/app/_services/members.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-hrmember-card',
  templateUrl: './hrmember-card.component.html',
  styleUrls: ['./hrmember-card.component.css']
})
export class HrmemberCardComponent implements OnInit {

  //we need to get all the users from the parent component (hrmembers-list)
  @Input() hrmember!: Member; 

  
  constructor(private memberService: MembersService, private toastr: ToastrService, private loginRegisterService: LoginregisterService) {
   }

  ngOnInit(): void {
  }

  addLike(member: Member) {
    this.memberService.addLike(member.username).subscribe(() => {
      this.toastr.success('Done! You showed some appreciation to ' + member.username);
    })
  }

}
