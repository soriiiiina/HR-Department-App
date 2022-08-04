import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-hrmembers-details',
  templateUrl: './hrmembers-details.component.html',
  styleUrls: ['./hrmembers-details.component.css']
})
export class HrmembersDetailsComponent implements OnInit {

  hrmember!: Member;

  constructor(private memberService: MembersService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.loadMember();
  }

  loadMember() { 
    this.memberService.getMember(this.route.snapshot.paramMap.get('username')!).subscribe(member =>
      this.hrmember = member)
  }

}
