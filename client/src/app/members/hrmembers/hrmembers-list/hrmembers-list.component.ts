import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-hrmembers-list',
  templateUrl: './hrmembers-list.component.html',
  styleUrls: ['./hrmembers-list.component.css']
})
export class HrmembersListComponent implements OnInit {

  //am observable of the member array 
  hrmembers$!: Observable<Member[]>;

  constructor(private memberService: MembersService) { }

  ngOnInit(): void {
    this.hrmembers$ = this.memberService.getMembers();
      }

}
