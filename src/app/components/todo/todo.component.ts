import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import {FormBuilder,FormControl, FormGroup, Validators} from '@angular/forms'
import { ITask } from '../models/task';
import { ITodos } from '../models/todos';
import { MyTaskList } from '../../mock-task';
import { TaskService } from '../../services/task.service';
import {FloatLabelType} from '@angular/material/form-field';
@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})

export class TodoComponent implements OnInit{
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  options = this.fb.group({
    hideRequired: this.hideRequiredControl,
    floatLabel: this.floatLabelControl,
  });

  updateId !:any;
  isEditEnabled : boolean = false
  constructor( private fb : FormBuilder, private taskService : TaskService){}

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || 'auto';
  }

  ngOnInit():void{
    this.taskService.getTasksService().subscribe(tasks => this.todos[0].todosTask = tasks)
    this.taskService.getTasksService().subscribe(tasks => this.tasks = tasks)

    console.log("got tasks",this.tasks)

    this.todoForm = this.fb.group({
      title : ['' , Validators.required],
      description : [''],
      done:[Boolean],
      reminder:[Boolean],
      priority:{String, enum:['low', 'medium', 'high'], default:'low'}
    })
  };
  todoForm ! : FormGroup;
  tasks: ITask[] = [];
  tasksInProgress : ITask[] = []
  tasksDone : ITask[] = [];
  todos:ITodos[] = [
    {
      todosTitle : "To do List",
      titleIcon: "list",
      todosTask : this.tasks,
      addTaskFunc : () => this.addTask,
      editFunc: () => this.onEdit,
      deleteFunc: () => this.deleteTask,
    },
    {
      todosTitle : "In Progress",
      titleIcon: "update",
      todosTask : this.tasksInProgress,
      deleteFunc: this.deleteTask,
    },
    {
      todosTitle : "Done",
      titleIcon: "done",
      todosTask : this.tasksDone,
      deleteFunc: this.deleteTask,
    },
  ]


  addTask(){
    this.todos[0].todosTask.push({
      id:this.todos[0].todosTask.length+1,
      title:this.todoForm.value.title,
      description:this.todoForm.value.description,
      reminder:this.todoForm.value.reminder || false,
      priority:this.todoForm.value.priority || "low",
      done:false
    })
    this.todoForm.reset()
  };

  deleteTask(i:number,taskGroup:string,task:ITask){
    this.taskService.deleteTaskService(task).subscribe(() => this.todos[0].todosTask =  this.todos[0].todosTask.filter(t => t.id !== task.id))
    switch(taskGroup){
      case "To do List":
          this.todos[0].todosTask.splice(i,1)
          break;

      case "In Progress":
          this.tasksInProgress.splice(i,1)
          break;

      case "Done":
          this.tasksDone.splice(i,1)
          break;
  };
  }



  onEdit(i:number, item:ITask){
    this.todoForm.controls['title'].setValue(item.title)
    this.todoForm.controls['description'].setValue(item.description)
    this.updateId = i;
    this.isEditEnabled = true;
  }



  updateTask(){
    this.todos[0].todosTask[this.updateId].title = this.todoForm.value.title
    this.todos[0].todosTask[this.updateId].description = this.todoForm.value.description
    this.todos[0].todosTask[this.updateId].done = false
    // this.todos[0].todosTask[this.updateId].reminder = this.todoForm.value.reminder
    this.taskService.updateTask(this.todos[0].todosTask[this.updateId]).subscribe()
    console.log("ttt", this.todos[0].todosTask[this.updateId])
    this.todoForm.reset()
    this.isEditEnabled = false;
    this.updateId = undefined;
  }


  cancelUpdate(){
    this.todoForm.reset()
    this.isEditEnabled = false;
    this.updateId = undefined;
  }

  onDone(i:number, task:ITask){
    this.tasksDone[i].done =  !this.tasksDone[i].done
    this.taskService.updateTask(task).subscribe()
  }

  onToggleReminder(i:number, task:ITask){
    this.todos[0].todosTask[i].reminder =  !this.todos[0].todosTask[i].reminder
    this.taskService.updateTask(task).subscribe()
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
