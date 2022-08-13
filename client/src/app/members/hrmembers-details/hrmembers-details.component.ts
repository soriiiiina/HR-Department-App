import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-hrmembers-details',
  templateUrl: './hrmembers-details.component.html',
  styleUrls: ['./hrmembers-details.component.css']
})
export class HrmembersDetailsComponent implements OnInit {
  //in order to go and get the memberTabs from the html component 
  @ViewChild('memberTabs', {static: true}) memberTabs!: TabsetComponent;
  activeTab!: TabDirective;

  hrmember!: Member;
  messages: Message[] = [];

  constructor(private memberService: MembersService, private route: ActivatedRoute,
    private messageService: MessageService) { }

  ngOnInit(): void {
    //guarantee that the route will have the member inside 
    this.route.data.subscribe(data => {
      this.hrmember = data.member;
    })

    this.route.queryParams.subscribe(params => {
      params.tab ? this.selectTab(params.tab) : this.selectTab(0);
    })
  }


  loadMessages() {
     this.messageService.getMessageThread(this.hrmember.username).subscribe(messages => {
      this.messages = messages;
    })
  }



  selectTab(tabId: number) {
   this.memberTabs.tabs[tabId].active = true;
  }

  actvateOnTab(data: TabDirective) {
    //gaining access to the information inside the tab 
    this.activeTab = data;
    if(this.activeTab.heading === 'Messages' && this.messages.length === 0) {
      this.loadMessages();
    }
    
  }

}
