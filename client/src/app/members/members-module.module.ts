import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrmembersDetailsComponent } from './hrmembers/hrmembers-details/hrmembers-details.component';
import { HrmembersListComponent } from './hrmembers/hrmembers-list/hrmembers-list.component';
import { LbgmembersListComponent } from './lbgmembers/lbgmembers-list/lbgmembers-list.component';
import { LbgmembersDetailsComponent } from './lbgmembers/lbgmembers-details/lbgmembers-details.component';
import { CoreteamsComponent } from './coreteams/coreteams.component';
import { DashboardSharedModule } from '../dashboard-shared/dashboard-shared.module';
import { MatIconModule } from '@angular/material/icon';
import { HrmemeberEditComponent } from './hrmembers/hrmemeber-edit/hrmemeber-edit.component';
import { RouterModule } from '@angular/router';
import { ProfileEditComponent } from './hrmembers/profile-edit/profile-edit.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    HrmembersDetailsComponent,
    HrmembersListComponent,
    LbgmembersListComponent,
    LbgmembersDetailsComponent,
    CoreteamsComponent,
    HrmemeberEditComponent,
    ProfileEditComponent
  ],
  imports: [
    CommonModule,
    DashboardSharedModule,
    MatIconModule,
    RouterModule,
    FormsModule
  ]
})
export class MembersModuleModule { }
