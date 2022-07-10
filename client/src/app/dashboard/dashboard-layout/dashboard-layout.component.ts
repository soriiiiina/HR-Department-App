import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-layout',
  templateUrl: './dashboard-layout.component.html',
  styleUrls: ['./dashboard-layout.component.css']
})
export class DashboardLayoutComponent implements OnInit {
  
  sidebarOpen = true; 

  constructor() { }

  ngOnInit(): void {
  }

  sidebarToggler(event: boolean) {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
