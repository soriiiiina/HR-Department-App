import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { PaginationInterface } from 'src/app/_models/pagination';
import { HRUser } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { LoginregisterService } from 'src/app/_services/loginregister.service';
import { MembersService } from 'src/app/_services/members.service';
import { map, take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { AuthorizationGuardGuard } from 'src/app/_guards/authorization-guard.guard';
import { AdminService } from 'src/app/_services/admin.service';

@Component({
  selector: 'app-hrmembers-list',
  templateUrl: './hrmembers-list.component.html',
  styleUrls: ['./hrmembers-list.component.css']
})
export class HrmembersListComponent implements OnInit {

  //am observable of the member array for the non filtering part 
  
  searchText : any;
  hrmembers!: HRUser;
  pagination!: PaginationInterface; 
  userParams!: UserParams;
  membersWithRole!: Partial<HRUser>;


  constructor(private memberService: MembersService,private route: ActivatedRoute, 
      private loginregisterService: LoginregisterService, private adminService: AdminService) {   
    this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void {
    this.loadHRMembers();
    this.getUsersWithRoles();
      }

  loadHRMembers() {
    this.memberService.setUserParams(this.userParams);
    this.memberService.getMembers(this.userParams).subscribe(response => {
      this.hrmembers = response.result;
      this.pagination = response.pagination;
    })
  }

  getUsersWithRoles() {
    this.adminService.getUsersWithRoles().subscribe(users => {
      this.membersWithRole = users!;
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
