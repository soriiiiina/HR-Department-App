import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginregisterService } from '../_services/loginregister.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  model: any = {} 
  loggedIn = false;
  registerMode = false;
  
  constructor(public loginregisterService: LoginregisterService, private router: Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
  } 

  registerToggle() { 
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMethod(event: boolean) {
    this.registerMode = event;
  }

  login() { 
    this.loggedIn = true;
    //the login method returns an observable (login was defined by me)
    this.loginregisterService.login(this.model).subscribe(response => {
      this.router.navigateByUrl('/dashboard')
    }, error => {
      console.log(error);
      //seing the reason the login failed
      this.toastr.error(error.error);
      this.router.navigateByUrl('')
    })
  }

  logout() {
    //using the logout method declared in the loginregisterService
    this.loginregisterService.logout(); 
    //redirecting the user to the home page 
    this.router.navigateByUrl('/');
  }

  //INCERCARE NEREUSITA
  btnLogin()
  {
    this.router.navigateByUrl('/dashboard');
  }

}
