import { Component, EventEmitter, Input, Output } from '@angular/core';
import {FormBuilder,FormControl, FormGroup, Validators} from '@angular/forms'
import { TaskService } from 'src/app/services/task.service';
import { ITask } from '../models/task';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent {
  @Output() addTask: EventEmitter<ITask> = new EventEmitter()
  @Output() updateTask: EventEmitter<ITask> = new EventEmitter()
  @Output() cancelUpdateTask: EventEmitter<ITask> = new EventEmitter()
  @Input() isEditEnabled:boolean
  @Input() taskToEdit:ITask
  @Input() editTaskSubject:Subject<any>;

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

        this.editTaskSubject.subscribe(task => {
        this.todoForm.controls['title'].setValue(task.title)
        this.todoForm.controls['description'].setValue(task.description)
        this.todoForm.controls['reminder'].setValue(task.reminder)
        this.todoForm.controls['priority'].setValue(task.priority)
        }
      )
  }

  onSubmitBtn(){
    const newTask = {
      ...this.todoForm.value
    }
    this.isEditEnabled = false;
    this.updateId = undefined;
    this.addTask.emit(newTask)
    this.onResetForm()
  }

  onUpdateBtn(){
    const updatedTask= {
      ...this.taskToEdit,
     title :this.todoForm.controls['title'].value,
     description :this.todoForm.controls['description'].value,
     done :this.todoForm.controls['done'].value,
     priority :this.todoForm.controls['priority'].value,
     reminder :this.todoForm.controls['reminder'].value
   }
     this.updateTask.emit(updatedTask)
     this.onResetForm()
   }

  onResetForm(){
    this.todoForm.controls['title'].setValue("")
    this.todoForm.controls['description'].setValue("")
    this.todoForm.controls['reminder'].setValue(false)
    this.todoForm.controls['priority'].setValue("low")
  }

  onCancelUpdateBtn(){
    console.log("hello cancel")
    this.cancelUpdateTask.emit()
    this.onResetForm()
  }

  onEdit(task:ITask){
    this.onResetForm()
  }

}
