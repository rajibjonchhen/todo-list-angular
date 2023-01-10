import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITask } from '../models/task';
import { ITodos } from '../models/todos';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent {
@Input() task:ITask
@Input() todo:ITodos
@Output() editTask = new EventEmitter()
@Output() deleteTask = new EventEmitter()
@Output() editReminder = new EventEmitter()
@Output() doneTask = new EventEmitter()

constructor(){}
  onEditReminderClicked(){
  console.log("hello ")
  }
  onEditBtn(task:ITask){
    this.editTask.emit(task)
  }
  onDeleteBtn(taskGroup:string, task:ITask){
    console.log("delete")
    this.deleteTask.emit({taskGroup, task})
  }
  onDoneBtn(task:ITask){
    console.log("done",task)
    this.doneTask.emit(task)
  }
}
