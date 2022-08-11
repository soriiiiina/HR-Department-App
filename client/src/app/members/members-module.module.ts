import { DashboardSharedModule } from '../dashboard-shared/dashboard-shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrmembersDetailsComponent } from './hrmembers/hrmembers-details/hrmembers-details.component';
import { HrmembersListComponent } from './hrmembers/hrmembers-list/hrmembers-list.component';
import { LbgmembersListComponent } from './lbgmembers/lbgmembers-list/lbgmembers-list.component';
import { LbgmembersDetailsComponent } from './lbgmembers/lbgmembers-details/lbgmembers-details.component';
import { CoreteamsComponent } from './coreteams/coreteams.component';
import { MatIconModule } from '@angular/material/icon';
import { HrmemeberEditComponent } from './hrmembers/hrmemeber-edit/hrmemeber-edit.component';
import { RouterModule } from '@angular/router';
import { ProfileEditComponent } from './hrmembers/profile-edit/profile-edit.component';
import { FormsModule } from '@angular/forms';
import { PhotoEditorComponent } from './photo-editor/photo-editor.component';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { MemberAppreciationComponent } from './member-appreciation/member-appreciation.component';

@NgModule({
  declarations: [
    HrmembersDetailsComponent,
    HrmembersListComponent,
    LbgmembersListComponent,
    LbgmembersDetailsComponent,
    CoreteamsComponent,
    HrmemeberEditComponent,
    ProfileEditComponent,
    PhotoEditorComponent,
    MemberAppreciationComponent,
  ],
  imports: [
    CommonModule,
    DashboardSharedModule,
    MatIconModule,
    RouterModule,
    FormsModule,
    FileUploadModule,
    NgxPaginationModule,
    PaginationModule.forRoot(),
    ButtonsModule.forRoot(),
  ],
  exports: [
    NgxPaginationModule,
    PaginationModule,
    ButtonsModule,
  ]
})
export class MembersModuleModule { }
