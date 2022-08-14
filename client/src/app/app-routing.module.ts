import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { MessagesComponent } from './dashboard-tools/messages/messages.component';
import { RecruitmentComponent } from './dashboard-tools/recruitment/recruitment.component';
import { TasksComponent } from './dashboard-tools/tasks/tasks.component';
import { DashboardLayoutComponent } from './dashboard/dashboard-layout/dashboard-layout.component';
import { DashboardMainComponent } from './dashboard/dashboard-main/dashboard-main.component';
import { NotFoundPageComponent } from './errors/not-found-page/not-found-page.component';
import { ServerErrorPageComponent } from './errors/server-error-page/server-error-page.component';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { HomeComponent } from './home/home.component';
import { CoreteamsComponent } from './members/coreteams/coreteams.component';
import { HrmembersDetailsComponent } from './members/hrmembers-details/hrmembers-details.component';
import { HrmembersListComponent } from './members/hrmembers-list/hrmembers-list.component';
import { ProfileEditComponent } from './members/profile-edit/profile-edit.component';
import { MemberAppreciationComponent } from './members/member-appreciation/member-appreciation.component';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import { RegisterComponent } from './register/register.component';
import { AuthorizationGuardGuard } from './_guards/authorization-guard.guard';
import { PreventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { MemberMessageComponent } from './members/member-message/member-message.component';
import { HRMemberDetailsResolver } from './_resolvers/hrmembers-details.resolver';
import { AdminPannelComponent } from './admin/admin-pannel/admin-pannel.component';
import { AdminGuard } from './_guards/admin.guard';


const routes: Routes = [
  //the home component has no path, when someone bropwses to localhost::5001 o sa ajunga la home component 
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'not-found-page',
    component: NotFoundPageComponent
  },
  {
    path: 'server-error',
    component: ServerErrorPageComponent
  },

  //preventing hijacking for all the routes 
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthorizationGuardGuard],
    children: [
      //DASHBOARD 
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,

    children: [{
      path: '',
      component: DashboardMainComponent
    },
    {
      path: 'hrmembers',
      component: HrmembersListComponent
    },
    {
      path: 'admin',
      component: AdminPannelComponent,
      canActivate: [AdminGuard]
    },
    {
      path: 'edit-profile',
      component: ProfileEditComponent,
      canDeactivate: [PreventUnsavedChangesGuard]
    },
    {
      path: 'photo-edit',
      component: PhotoEditorComponent,
    },
    //the next path has a root parameter 
    {
      path: 'hrmember/:username',
      component: HrmembersDetailsComponent,
      resolve: {member: HRMemberDetailsResolver}
    },
    {
      path: 'coreteams',
      component: CoreteamsComponent
    },
    {
      path: 'tasks',
      component: TasksComponent
    },
    {
      path: 'calendar',
      component: CalendarComponent
    },
    {
      path: 'allmessages',
      component: MemberMessageComponent
    },
    {
      path: 'messages',
      component: MessagesComponent
    },
    {
      path: 'recruitment',
      component: RecruitmentComponent
    },
    {
      path: 'errors',
      component: TestErrorsComponent
    },
    {
      path: 'member-appreciation',
      component: MemberAppreciationComponent
    }
    ]
  },
    ]
  },

  //wildcard route --> for when the user types something that does not exist 
  { path: '**', component: HomeComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
