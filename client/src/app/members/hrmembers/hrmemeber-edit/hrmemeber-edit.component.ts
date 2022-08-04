import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-hrmemeber-edit',
  templateUrl: './hrmemeber-edit.component.html',
  styleUrls: ['./hrmemeber-edit.component.css']
})
export class HrmemeberEditComponent implements OnInit {

  hrmember!: Member;

  constructor(private memberService: MembersService, private route: ActivatedRoute) { }

  ngOnInit(): void {
 
  }



}
