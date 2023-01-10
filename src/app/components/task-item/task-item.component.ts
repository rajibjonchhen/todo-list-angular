import { Component, Input } from '@angular/core';
import { ITask } from '../models/task';
import { ITodos } from '../models/todos';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent {
@Input() task:ITask
@Input() todo:ITodos
@Input() i:number|string

constructor(){}
  // updateTask(){
  //   this.todos[0].todosTask[this.updateId].title = this.todoForm.value.title
  //   this.todos[0].todosTask[this.updateId].description = this.todoForm.value.description
  //   this.taskService.updateTaskService(this.todos[0].todosTask[this.updateId]).subscribe()
  //   console.log("ttt", this.todos[0].todosTask[this.updateId])
  //   this.todoForm.reset()
  //   this.isEditEnabled = false;
  //   this.updateId = undefined;
  // }
}
