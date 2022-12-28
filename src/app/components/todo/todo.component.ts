import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import { ITask } from '../models/task';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent {
  todoForm ! : FormGroup;
  tasks: ITask[] = [];
  tasksInProgress : ITask[] = []
  tasksDone : ITask[] = [];
  updateId !:any;
  isEditEnabled : boolean = false
  constructor( private fb : FormBuilder){}

  ngOnInit():void{
    this.todoForm = this.fb.group({
      itemTitle : ['' , Validators.required],
      itemDescription : ['']
    })
  };

  addTask(){
    this.tasks.push({
      title:this.todoForm.value.itemTitle,
      description:this.todoForm.value.itemDescription,
      done:false
    })
    this.todoForm.reset()
  };

  deleteTask(i:number){
    this.tasks.splice(i,1)
  };

  deleteTaskInProgress(i:number){
    this.tasksInProgress.splice(i,1)
  };

  deleteTaskDone(i:number){
    this.tasksDone.splice(i,1)
  }

  onEdit(i:number, item:ITask){
    this.todoForm.controls['itemTitle'].setValue(item.title)
    this.todoForm.controls['itemDescription'].setValue(item.description)
    this.updateId = i;
    this.isEditEnabled = true;
  }

  updateTask(){
    this.tasks[this.updateId].title = this.todoForm.value.itemTitle
    this.tasks[this.updateId].description = this.todoForm.value.itemDescription
    this.tasks[this.updateId].done = false
    this.todoForm.reset()
    this.isEditEnabled = false;
    this.updateId = undefined;
  }

  drop(event: CdkDragDrop<ITask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
