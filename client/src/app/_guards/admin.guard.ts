import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {  Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginregisterService } from '../_services/loginregister.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private loginregisterService: LoginregisterService, private toastr: ToastrService) {}



  canActivate(): Observable<boolean> {
    return this.loginregisterService.currentHRUser$.pipe(
      map(user => {
        if (user!.roles.includes('Admin') || user!.roles.includes('TeamMember')) {
          return true;
        }
        this.toastr.error('You cannot enter this area');
        return false;
      })
    )
  }
}
  
