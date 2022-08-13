import { Component, OnInit } from '@angular/core';
import { PaginationComponent } from 'ngx-bootstrap/pagination';
import { Message } from 'src/app/_models/message';
import { PaginationInterface } from 'src/app/_models/pagination';
import { MessageService } from 'src/app/_services/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages!: Message[];
  pagination!: PaginationInterface;
  container = "Unread";
  pageNumber = 1; 
  pageSize = 5;
  loadingFlag = false;

  constructor(private messageService: MessageService ) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages() {
    this.loadingFlag = true;
    this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe(response => {
      this.messages = response.result;
      this.pagination = response.pagination;
      this.loadingFlag = false;
    })
  }

  deleteMessage(id: number) {
    this.messageService.deleteMessage(id).subscribe(()=> {
      this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
    })
  }

  pageChanged (event: any) {
    this.pageNumber = event.page;
    this.loadMessages();
  }

}
