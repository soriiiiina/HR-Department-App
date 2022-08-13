import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks/tasks.component';
import { CalendarComponent } from './calendar/calendar.component';
import { RecruitmentComponent } from './recruitment/recruitment.component';
import { MessagesComponent } from './messages/messages.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { DashboardSharedModule } from '../dashboard-shared/dashboard-shared.module';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@NgModule({
  declarations: [
    TasksComponent,
    CalendarComponent,
    RecruitmentComponent,
    MessagesComponent
  ],
  imports: [
    PaginationModule,
    MatListModule,
    MatMenuModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatDividerModule,
    CommonModule,
    BrowserModule,
    FormsModule,
    TimeagoModule.forRoot(),
    RouterModule,
    DashboardSharedModule,
    ButtonsModule.forRoot()
  ],
  exports: [
    TasksComponent,
    CalendarComponent,
    RecruitmentComponent,
    MessagesComponent,
    TimeagoModule,
    ButtonsModule

  ]
})
export class ToolsModuleModule { }
