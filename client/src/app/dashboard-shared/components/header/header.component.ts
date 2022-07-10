import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LoginregisterService } from 'src/app/_services/loginregister.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();

  constructor(public loginregisterService: LoginregisterService, private router: Router) { }

  ngOnInit(): void {
  }

  //each time we click, an event is emmitted
  toggleSidebar() {
    this.toggleSideBarForMe.emit();

    //make the graphs resize when the side bar is toggled
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300)
  }

  logout() {
    //using the logout method declared in the loginregisterService
    this.loginregisterService.logout(); 
    //redirecting the user to the home page 
    this.router.navigateByUrl('/');
  }


}
