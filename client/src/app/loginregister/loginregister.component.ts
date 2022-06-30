import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HRUser } from '../_models/user';
import { LoginregisterService } from '../_services/loginregister.service';

@Component({
  selector: 'app-loginregister',
  templateUrl: './loginregister.component.html',
  styleUrls: ['./loginregister.component.css']
})
export class LoginregisterComponent implements OnInit {
  //creating a class property to store what the user enters into the login form 
  model: any = {} 
  registerMode = false;
  loggedIn = false;

  constructor(public loginregisterService: LoginregisterService, private router: Router) { }

  ngOnInit(): void {
  }

  login() { 
    this.loggedIn = true;
    //the login method returns an observable (login was defined by me)
    this.loginregisterService.login(this.model).subscribe(response => {
      console.log(response);
    }, error => {
      console.log(error);
    })
  }

  logout() {
    //using the logout method declared in the loginregisterService
    this.loginregisterService.logout(); 
  }

  //INCERCARE NEREUSITA
  btnLogin()
  {
    this.router.navigateByUrl('/dashboard');
  }

}
