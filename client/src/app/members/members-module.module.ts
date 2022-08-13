import { DashboardSharedModule } from '../dashboard-shared/dashboard-shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HrmembersDetailsComponent } from './hrmembers-details/hrmembers-details.component';
import { HrmembersListComponent } from './hrmembers-list/hrmembers-list.component';
import { CoreteamsComponent } from './coreteams/coreteams.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { FormsModule } from '@angular/forms';
import { PhotoEditorComponent } from './photo-editor/photo-editor.component';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { MemberAppreciationComponent } from './member-appreciation/member-appreciation.component';
import { MemberMessageComponent } from './member-message/member-message.component';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
  declarations: [
    HrmembersDetailsComponent,
    HrmembersListComponent,
    CoreteamsComponent,
    ProfileEditComponent,
    PhotoEditorComponent,
    MemberAppreciationComponent,
    MemberMessageComponent,
  ],
  imports: [
    CommonModule,
    DashboardSharedModule,
    MatIconModule,
    MatTabsModule,
    RouterModule,
    FormsModule,
    FileUploadModule,
    NgxPaginationModule,
    PaginationModule.forRoot(),
    ButtonsModule.forRoot(),
    TabsModule.forRoot(),
  ],
  exports: [
    NgxPaginationModule,
    PaginationModule,
    ButtonsModule,
    TabsModule
  ]
})
export class MembersModuleModule { }
