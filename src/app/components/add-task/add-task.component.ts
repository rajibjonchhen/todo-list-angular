import { Component, EventEmitter, Output } from '@angular/core';
import {FormBuilder,FormControl, FormGroup, Validators} from '@angular/forms'
import { TaskService } from 'src/app/services/task.service';
import { ITask } from '../models/task';


@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent {
  @Output() onAddTask: EventEmitter<ITask> = new EventEmitter()
  @Output() updateTask: EventEmitter<ITask> = new EventEmitter()

  todoForm ! : FormGroup;
  isEditEnabled : boolean = false
  updateId !:any;
  constructor( private fb : FormBuilder, private taskService : TaskService){}

  ngOnInit():void{
      this.todoForm = this.fb.group({
        title : ['' , Validators.required],
        description : [''],
        done: false,
        reminder:false,
        priority:'low',
      })
  }

  onSubmit(){
    const newTask = {
      ...this.todoForm.value
    }
    this.todoForm.reset()
    this.isEditEnabled = false;
    this.updateId = undefined;
    this.onAddTask.emit(newTask)
  }

  // onUpdateTask(task){
  //   console.log("hello sdf")
  //   this.updateTask.emit(task)
  // }

  onEdit(i:number, item:ITask){
    this.todoForm.controls['title'].setValue(item.title)
    this.todoForm.controls['description'].setValue(item.description)
    this.updateId = i;
    this.isEditEnabled = true;
  }



  onUpdateTask(task){
    this.todoForm.controls['title'].setValue(task.title)
    this.todoForm.controls['description'].setValue(task.description)
    this.todoForm.controls['done'].setValue(task.done)
    this.todoForm.controls['priority'].setValue(task.priority)
    this.todoForm.controls['reminder'].setValue(task.reminder)
    this.isEditEnabled = true;
    this.onAddTask.emit()
  }

}
