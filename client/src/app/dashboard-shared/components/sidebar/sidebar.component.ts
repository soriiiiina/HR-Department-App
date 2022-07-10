import { Component, OnInit } from '@angular/core';
import { LoginregisterService } from 'src/app/_services/loginregister.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(public loginregisterService: LoginregisterService) { }

  ngOnInit(): void {
  }

}
