import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';

@Component({
  selector: 'app-hrmember-card',
  templateUrl: './hrmember-card.component.html',
  styleUrls: ['./hrmember-card.component.css']
})
export class HrmemberCardComponent implements OnInit {

  //we need to get all the users from the parent component (hrmembers-list)
  @Input() hrmember!: Member; 
  
  constructor() { }

  ngOnInit(): void {
  }

}
