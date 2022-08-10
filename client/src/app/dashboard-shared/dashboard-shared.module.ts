import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './widgets/table/table.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { HrmemberCardComponent } from './widgets/hrmember-card/hrmember-card.component';
import { MemberPhotoCardComponent } from './widgets/member-photo-card/member-photo-card.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TimeagoModule } from 'ngx-timeago';

@NgModule({
  declarations: [
    TableComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    HrmemberCardComponent,
    MemberPhotoCardComponent
  ],
  imports: [
    CommonModule,
    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule, 
    MatMenuModule,
    MatListModule,
    RouterModule,
    PaginationModule.forRoot(),
    TimeagoModule.forRoot(),
  ],
  exports: [
    TableComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    HrmemberCardComponent,
    MemberPhotoCardComponent,
    PaginationModule,
    TimeagoModule
  ]
})
export class DashboardSharedModule { }
