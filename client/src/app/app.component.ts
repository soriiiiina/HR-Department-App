import { HttpClient } from '@angular/common/http';
import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { HRUser } from './_models/user';
import { LoginregisterService } from './_services/loginregister.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'HR Department App';
  hrusers : any;

  constructor(private loginRegisterService: LoginregisterService) {}

  ngOnInit() {
    this.setCurrentUser();
  }

  setCurrentUser() {
    //we stringify the object inside local storage (in loginregister service), so we use json.parse to get the object out
    const hruser: HRUser = JSON.parse(localStorage.getItem('hruser')!);
    this.loginRegisterService.setCurrentHRUser(hruser);
  }
}
