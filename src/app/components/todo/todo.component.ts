import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import {FormBuilder,FormControl, FormGroup, Validators} from '@angular/forms'
import { ITask } from '../models/task';
import { ITodos } from '../models/todos';
import { MyTaskList } from '../../mock-task';
import { TaskService } from '../../services/task.service';
import {FloatLabelType} from '@angular/material/form-field';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})

export class TodoComponent implements OnInit{
  @Output() isEditEnabled : boolean = false
  @Output() taskToEdit : ITask = null

  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto' as FloatLabelType);

  options = this.fb.group({
    hideRequired: this.hideRequiredControl,
    floatLabel: this.floatLabelControl,
  });

  updateId !:any;


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
      done:{Boolean, default:false},
      reminder:{Boolean, default:false},
      priority:{String, enum:['low', 'medium', 'high'], default:'low'}
    })
  }


  addTask(newTask){
    const newTaskWithId = {...newTask, id:uuidv4() }
    console.log(newTask)
    this.taskService.addTasksService(newTaskWithId).subscribe((task)=>  this.todos[0].todosTask.push({...task
    }))
    console.log(this.todos[0].todosTask)
  };

  deleteTask(taskGroup:string,task:ITask){
    console.log("delete")
    this.taskService.deleteTaskService(task).subscribe(() => this.todos[0].todosTask =  this.todos[0].todosTask.filter(t => t.id !== task.id))
    switch(taskGroup){
      case "To do List":
          this.todos[0].todosTask = [ ...this.todos[0].todosTask.filter(t => t.id !== task.id)]

          break;
      case "In Progress":
        this.todos[1].todosTask = [ ...this.todos[1].todosTask.filter(t => t.id !== task.id)]
        break;

      case "Done":
        this.todos[2].todosTask = [ ...this.todos[2].todosTask.filter(t => t.id !== task.id)]
          break;
  };
  }



  // onEdit(task:ITask){
  //   console.log("edit 000", task)
  //   this.todoForm.controls['title'].setValue(task.title)
  //   this.todoForm.controls['description'].setValue(task.description)
  //   this.updateId = task.id;
  //   this.isEditEnabled = true;
  // }
  onEdit(task:ITask){
    console.log("edit 000", task)
    this.taskToEdit = task;
    this.isEditEnabled = !this.isEditEnabled;
  }


  cancelUpdate(){
    this.todoForm.reset()
    this.isEditEnabled = false;
    this.updateId = undefined;
  }

  onDone(i:number, task:ITask){
    this.tasksDone[i].done =  !this.tasksDone[i].done
    this.taskService.updateTaskService(task).subscribe()
  }

  onToggleReminder(i:number, task:ITask){
    this.todos[0].todosTask[i].reminder =  !this.todos[0].todosTask[i].reminder
    this.taskService.updateTaskService(task).subscribe()
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
