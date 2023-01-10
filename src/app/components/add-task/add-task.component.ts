import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() onUpdateTask: EventEmitter<ITask> = new EventEmitter()
  @Output() onCancelUpdateTask: EventEmitter<ITask> = new EventEmitter()
  @Input() isEditEnabled:boolean
  @Input() taskToEdit:ITask

  todoForm ! : FormGroup;

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

  onSubmitBtn(){
    const newTask = {
      ...this.todoForm.value
    }
    this.isEditEnabled = false;
    this.updateId = undefined;
    this.onAddTask.emit(newTask)
    this.todoForm.controls['title'].setValue("")
    this.todoForm.controls['description'].setValue("")
    this.todoForm.controls['reminder'].setValue(false)
    this.todoForm.controls['priority'].setValue("low")
  }


  onCancelUpdateBtn(){
    console.log("hello cancel")
    this.onCancelUpdateTask.emit()
  }

  onEdit(task:ITask){

    if(this.isEditEnabled){
      this.todoForm.controls['title'].setValue(this.taskToEdit.title)
      this.todoForm.controls['description'].setValue(this.taskToEdit.description)
    }

  }



  onUpdateBtn(){
   const newTask= {
    title :this.todoForm.controls['title'].value,
    description :this.todoForm.controls['description'].value,
    done :this.todoForm.controls['done'].value,
    priority :this.todoForm.controls['priority'].value,
    reminder :this.todoForm.controls['reminder'].value
  }

    this.onUpdateTask.emit(newTask)
  }

}
