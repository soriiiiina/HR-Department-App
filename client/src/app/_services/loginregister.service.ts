import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HRUser } from '../_models/user';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class LoginregisterService {

  baseUrl = environment.apiUrl;
  
  //an observable to store the user into 
  private currentHRUserSource = new ReplaySubject<HRUser | null>(1);
  currentHRUser$ = this.currentHRUserSource.asObservable();

  constructor(private http : HttpClient, private presence: PresenceService) { }

  login(model: any) {
    //we are sending up the model that contains the user and the password & persisteing the login
    return this.http.post(this.baseUrl + 'loginregister/login', model).pipe(
      //we want to get the response that we're getting back from the server 
      map((response: any)=> {
        const hruser = response;
        if(hruser){
          //the data will remain in the localStorage of the browser
          this.setCurrentHRUser(hruser);
          this.presence.createHubConnection(hruser);
        }
      })
    )
  }

  setCurrentHRUser(hruser: HRUser){
    hruser.roles = [];

    //taking the current users roles from the token 
    const roles = this.getDecodedToken(hruser.userToken)!.role;

    Array.isArray(roles) ? hruser.roles=roles : hruser.roles.push(roles);

    localStorage.setItem('hruser', JSON.stringify(hruser));
    this.currentHRUserSource.next(hruser);
  }

  logout() {
    localStorage.removeItem('hruser');
    this.currentHRUserSource.next(null);
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'loginregister/register', model).pipe(
      map((hruser: any) => {
        if (hruser) {
          this.setCurrentHRUser(hruser);
          this.presence.createHubConnection(hruser);
        }
      //returning the HRUSer object --> in order to see it in the console; not mandatory 
      return hruser; 
      })
    )
  }

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
