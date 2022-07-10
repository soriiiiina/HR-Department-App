import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks/tasks.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ArboreComponent } from './arbore/arbore.component';
import { RecruitmentComponent } from './recruitment/recruitment.component';



@NgModule({
  declarations: [
    TasksComponent,
    CalendarComponent,
    ArboreComponent,
    RecruitmentComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ToolsModuleModule { }
