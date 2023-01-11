import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { TaskService } from '../../services/task.service';
import { ITask } from '../models/task';
import { ITodos } from '../models/todos';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})

export class TodoComponent implements OnInit{
  @Output() isEditEnabled : boolean = false
  @Output() taskToEdit : ITask = null

  editTaskSubject:Subject<any> = new Subject();

  updateId !:any;
  todoForm ! : FormGroup;
  todos:ITodos[] = [
    {
      todosTitle : "To do List",
      titleIcon: "list",
      todosTask: []
    },
    {
      todosTitle : "In Progress",
      titleIcon: "update",
      todosTask : []
    },
    {
      todosTitle : "Done",
      titleIcon: "done",
      todosTask : []
    },
  ]

  constructor( private fb : FormBuilder, private taskService : TaskService){}

  ngOnInit():void{
    this.taskService.getTasksService().subscribe(tasks => {
      this.todos[0].todosTask  = [...tasks]
    })

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
    this.taskService.addTasksService(newTaskWithId).subscribe((t)=>  this.todos[0].todosTask.push({...t}))
  };

  updateTask(updatedTask:ITask){
    this.taskService.updateTaskService(updatedTask).subscribe((upTask) =>
    {
      const i = this.todos[0].todosTask.findIndex(t=> t.id === upTask.id )
      if(i>=0){
        this.todos[0].todosTask[i]= {...upTask}
      }
    })
  }

  onDeleteTask(taskGroup:string,task:ITask){
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

  onEdit(task:ITask){
    this.taskToEdit = task;
    this.isEditEnabled = true;
    this.activateEdit(task)
  }

  activateEdit(task){
    this.editTaskSubject.next(task)
  }

  cancelUpdate(){
    this.todoForm.reset()
    this.isEditEnabled = false;
  }

  onDone(task:ITask){
    const i = this.todos[2].todosTask.findIndex(t => t.id === task.id)
    this.todos[2].todosTask[i].done =  !this.todos[2].todosTask[i].done
    this.taskService.updateTaskService(task).subscribe()
  }

  onToggleReminder(task:ITask){
    const i = this.todos[0].todosTask.findIndex(t => t.id === task.id)
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
