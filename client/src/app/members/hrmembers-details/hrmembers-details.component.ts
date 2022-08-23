import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { Message } from 'src/app/_models/message';
import { HRUser } from 'src/app/_models/user';
import { LoginregisterService } from 'src/app/_services/loginregister.service';
import { MembersService } from 'src/app/_services/members.service';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';
import {take} from 'rxjs/operators'

@Component({
  selector: 'app-hrmembers-details',
  templateUrl: './hrmembers-details.component.html',
  styleUrls: ['./hrmembers-details.component.css']
})
export class HrmembersDetailsComponent implements OnInit, OnDestroy {
  //in order to go and get the memberTabs from the html component 
  @ViewChild('memberTabs', {static: true}) memberTabs!: TabsetComponent;
  activeTab!: TabDirective;

  hrmember!: Member;
  messages: Message[] = [];
  user!: HRUser;

  constructor(private memberService: MembersService, private route: ActivatedRoute,
    private messageService: MessageService, public presence: PresenceService, 
    private loginRegisterService: LoginregisterService, private router: Router) {
      this.loginRegisterService.currentHRUser$.pipe(take(1)).subscribe(user => this.user = user!);
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
     }


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

  //we will activate the message hub when we click on the tab 
  actvateOnTab(data: TabDirective) {
    //gaining access to the information inside the tab 
    this.activeTab = data;
    if(this.activeTab.heading === 'Messages' && this.messages.length === 0) {
      this.messageService.createHubConnection(this.user, this.hrmember.username);
    }
    else { //if we change tabs, we stop the hub connection 
      this.messageService.stopHubConnection();
    }
    
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

}
