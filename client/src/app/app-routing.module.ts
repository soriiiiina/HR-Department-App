import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { ArboreComponent } from './dashboard-tools/arbore/arbore.component';
import { RecruitmentComponent } from './dashboard-tools/recruitment/recruitment.component';
import { TasksComponent } from './dashboard-tools/tasks/tasks.component';
import { DashboardLayoutComponent } from './dashboard/dashboard-layout/dashboard-layout.component';
import { DashboardMainComponent } from './dashboard/dashboard-main/dashboard-main.component';
import { NotFoundPageComponent } from './errors/not-found-page/not-found-page.component';
import { ServerErrorPageComponent } from './errors/server-error-page/server-error-page.component';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { HomeComponent } from './home/home.component';
import { CoreteamsComponent } from './members/coreteams/coreteams.component';
import { HrmembersDetailsComponent } from './members/hrmembers/hrmembers-details/hrmembers-details.component';
import { HrmembersListComponent } from './members/hrmembers/hrmembers-list/hrmembers-list.component';
import { LbgmembersDetailsComponent } from './members/lbgmembers/lbgmembers-details/lbgmembers-details.component';
import { LbgmembersListComponent } from './members/lbgmembers/lbgmembers-list/lbgmembers-list.component';
import { AuthorizationGuardGuard } from './_guards/authorization-guard.guard';


const routes: Routes = [
  //the home component has no path, when someone bropwses to localhost::5001 o sa ajunga la home component 
  {
    path: '',
    component: HomeComponent
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
    component: DashboardLayoutComponent, canActivate: [AuthorizationGuardGuard],

    children: [{
      path: '',
      component: DashboardMainComponent
    },
    {
      path: 'hrmembers',
      component: HrmembersListComponent
    },
    //the next path has a root parameter 
    {
      path: 'hrmember/:id',
      component: HrmembersDetailsComponent
    },
    {
      path: 'lbgmembers',
      component: LbgmembersListComponent
    },
    {
      path: 'lbgmember/:id',
      component: LbgmembersDetailsComponent
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
      path: 'arbore',
      component: ArboreComponent
    },
    {
      path: 'recruitment',
      component: RecruitmentComponent
    },
    {
      path: 'errors',
      component: TestErrorsComponent
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
