import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardLayoutComponent } from './dashboard-layout/dashboard-layout.component';
import { DashboardMainComponent } from './dashboard-main/dashboard-main.component';
import { DashboardSharedModule } from '../dashboard-shared/dashboard-shared.module';
import { RouterModule } from '@angular/router';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    //components that i created
    DashboardLayoutComponent,
    DashboardMainComponent,
  ],
  imports: [
    CommonModule,
    DashboardSharedModule,
    RouterModule,
    MatSidenavModule,
    MatDividerModule,
    MatCardModule,
    FlexLayoutModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule
  ],
  exports: [
    DashboardLayoutComponent,
    DashboardMainComponent
  ]
})
export class DashboardModule { }
