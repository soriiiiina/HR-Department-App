import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';
import { LoginregisterService } from '../_services/loginregister.service';

@Injectable({
  providedIn: 'root'
})

export class AuthorizationGuardGuard implements CanActivate {

  constructor(private loginregisterservice: LoginregisterService, private toastr: ToastrService) {}

    canActivate(): Observable<boolean> {
      return this.loginregisterservice.currentHRUser$.pipe(
        map(hruser => { 
          //daca userul e authenticated, the user can access the dashboard
          if (hruser) return true;
          this.toastr.error('You shall not pass!')
          return false;
        })
      )
    }
  
}
