import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';
import { Member } from 'src/app/_models/member';
import { PaginationInterface } from 'src/app/_models/pagination';
import { HRUser } from 'src/app/_models/user';
import { UserParams } from 'src/app/_models/userParams';
import { AdminService } from 'src/app/_services/admin.service';
import { LoginregisterService } from 'src/app/_services/loginregister.service';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-lbgmembers-list',
  templateUrl: './lbgmembers-list.component.html',
  styleUrls: ['./lbgmembers-list.component.css']
})
export class LbgmembersListComponent implements OnInit {

 //am observable of the member array for the non filtering part 
  
 searchText : any;
 hrmembers!: HRUser[];
 pagination!: PaginationInterface; 
 userParams!: UserParams;
 hruser!: HRUser;
 membersWithRole!: Partial<HRUser[]>;
 searchResult!: Member[];
 teamMember!: HRUser[];
 simpleMember!: HRUser[];


 constructor(private memberService: MembersService,private route: ActivatedRoute, 
     private loginregisterService: LoginregisterService, private adminService: AdminService) {   
   this.userParams = this.memberService.getUserParams();
   this.loginregisterService.currentHRUser$.pipe(take(1)).subscribe(hruser => {
     this.hruser = hruser!
   });
 }

 ngOnInit(): void {
   this.loadHRMembers();

   if(this.hruser.roles.includes("Admin")){
     this.getUsersWithRoles();
   }
     }

 loadHRMembers() {
   this.memberService.setUserParams(this.userParams);
   this.memberService.getMembers(this.userParams).subscribe(response => {
     this.hrmembers = response.result;
     this.pagination = response.pagination;
     console.log(this.hrmembers);
   })
 }

 searchHRMembers(searchText: string) {
   searchText 
     ? this.memberService.searchMembers(searchText).subscribe(response => {
       this.searchResult = response;
       }) 
     : null;
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
