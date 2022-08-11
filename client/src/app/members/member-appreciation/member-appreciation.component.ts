import { Component, OnInit } from '@angular/core';
import { PaginationComponent } from 'ngx-bootstrap/pagination';
import { Member } from 'src/app/_models/member';
import { PaginationInterface } from 'src/app/_models/pagination';
import { MembersService } from 'src/app/_services/members.service';

@Component({
  selector: 'app-member-appreciation',
  templateUrl: './member-appreciation.component.html',
  styleUrls: ['./member-appreciation.component.css']
})
export class MemberAppreciationComponent implements OnInit {
  //Partial tells us that each one of the properties of member is optional
  hrmembers!: Partial<Member[]>;
  //default value assigned
  predicate = 'liked'; 
  pageNumer = 1; 
  pageSize = 9; 
  pagination!: PaginationInterface;

  constructor(private membersService: MembersService) { }

  ngOnInit(): void {
    this.loadLikes();
  }

  loadLikes() {
    this.membersService.getLikes(this.predicate, this.pageNumer, this.pageSize).subscribe(response => {
      this.hrmembers = response.result;
      this.pagination = response.pagination;
    })
  }

  pageChanged(event: any) {
    this.pageNumer = event.page; 
    this.loadLikes();
  }

}
