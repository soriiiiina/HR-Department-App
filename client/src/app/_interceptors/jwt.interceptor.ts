import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginregisterService } from '../_services/loginregister.service';
import { HRUser } from '../_models/user';
import { take } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private loginRegisterService: LoginregisterService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentHRUser: HRUser | undefined;

    //take(1) --> we use this until we have a current user (we take it)
    //we dont have to unsubscribe, because we are using pipe & take
    this.loginRegisterService.currentHRUser$.pipe(take(1)).subscribe(user => currentHRUser = user!);

    if(currentHRUser) {
      //the token will be attached to every request when we log in 
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentHRUser.userToken}`
        }
      })
    }
    return next.handle(request);
  }
}
