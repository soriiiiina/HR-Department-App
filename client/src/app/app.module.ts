import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { FileSelectDirective } from 'ng2-file-upload';

import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { CalendarComponent } from './calendar/calendar.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { MembersModuleModule } from './members/members-module.module';
import { ToastrModule } from 'ngx-toastr';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { ErrorInterceptor } from './_interceptors/error.interceptor';
import { NotFoundPageComponent } from './errors/not-found-page/not-found-page.component';
import { ServerErrorPageComponent } from './errors/server-error-page/server-error-page.component';
import { DashboardSharedModule } from './dashboard-shared/dashboard-shared.module';
import { HrmemberCardComponent } from './dashboard-shared/widgets/hrmember-card/hrmember-card.component';
import { JwtInterceptor } from './_interceptors/jwt.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HomeComponent,
    CalendarComponent,
    TestErrorsComponent,
    NotFoundPageComponent,
    ServerErrorPageComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    HttpClientModule, 
    BrowserAnimationsModule,
    FormsModule,
    BsDropdownModule.forRoot(),

    DashboardModule,
    
    MembersModuleModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    }),
    BrowserAnimationsModule,
    FormsModule,
    
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
