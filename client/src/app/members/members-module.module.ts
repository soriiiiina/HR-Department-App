import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrmembersDetailsComponent } from './hrmembers/hrmembers-details/hrmembers-details.component';
import { HrmembersListComponent } from './hrmembers/hrmembers-list/hrmembers-list.component';
import { LbgmembersListComponent } from './lbgmembers/lbgmembers-list/lbgmembers-list.component';
import { LbgmembersDetailsComponent } from './lbgmembers/lbgmembers-details/lbgmembers-details.component';
import { CoreteamsComponent } from './coreteams/coreteams.component';



@NgModule({
  declarations: [
    HrmembersDetailsComponent,
    HrmembersListComponent,
    LbgmembersListComponent,
    LbgmembersDetailsComponent,
    CoreteamsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MembersModuleModule { }
