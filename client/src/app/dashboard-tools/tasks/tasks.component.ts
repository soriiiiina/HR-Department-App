import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  taskList: any[] = [];
  newToDoForm = this.fromBuilder.group({
    todoItem: ''
  });

  constructor(private fromBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.taskList = localStorage.getItem('task') ? 
      JSON.parse(localStorage.getItem('task')!) : [];
  }

  addTask() {
    if(this.newToDoForm.value.todoItem){
      const value = this.newToDoForm.value.todoItem;
      this.taskList.unshift({id: this.taskList.length, name: value, completed: false});
  
      //adding the task to the local storage
      //the key is the task and the calue is the tasklist
      localStorage.setItem('task', JSON.stringify(this.taskList));
      this.newToDoForm.reset();
    }
   
    
  }

  markDone(value: any) {
    value.completed = !value.completed;
    value.completed === true ? 
      this.taskList.push(this.taskList.splice(this.taskList.indexOf(value), 1)[0]) :
      this.taskList.unshift(this.taskList.splice(this.taskList.indexOf(value), 1)[0]);
  }

  removeTask(value: any) {
    //splice method will remove the task with the index i 
    this.taskList = this.taskList.filter(t => t.id != value.id);

    //removing from the local storage 
    localStorage.setItem('task', JSON.stringify(this.taskList));
  }

}
