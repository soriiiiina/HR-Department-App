import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { PaginationInterface } from 'src/app/_models/pagination';
import { HRUser } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { LoginregisterService } from 'src/app/_services/loginregister.service';
import { MembersService } from 'src/app/_services/members.service';
import { take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hrmembers-list',
  templateUrl: './hrmembers-list.component.html',
  styleUrls: ['./hrmembers-list.component.css']
})
export class HrmembersListComponent implements OnInit {

  //am observable of the member array for the non filtering part 
  
  search : String ="";
  hrmembers!: Member[];
  hrmember!: Member;
  pagination!: PaginationInterface; 
  userParams!: UserParams;
  hruser!: HRUser;
  ngSelect = 'ETTI';
  facultyList =[{value: 'Automation', display: 'Automation'},
                {value: 'Computer', display: 'Computer'},
                {value: 'ETTI', display: 'ETTI'},
                {value: 'Robotics', display: 'Robotics'},
                {value: 'Mechanics', display: 'Mechanics'},
                {value: 'Architecture', display: 'Architecture'},
                {value: 'Construction', display: 'Construction'},
              ];

  constructor(private memberService: MembersService,private route: ActivatedRoute) { 
    this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void {
    this.loadHRMembers();
      }

  loadHRMembers() {
    this.memberService.setUserParams(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe(response => {
      this.hrmembers = response.result;
      this.pagination = response.pagination;
    })
  }

  resetFilters() {
    this.userParams = this.memberService.resetUserParams();
    this.loadHRMembers();
  }

  pageChanged(event: any) {
    this.userParams.pageNumber = event.page;
    this.memberService.setUserParams(this.userParams);
    this.loadHRMembers();
  }
}
