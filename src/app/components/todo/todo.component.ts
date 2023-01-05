import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms'
import { ITask } from '../models/task';
import { ITodos } from '../models/todos';
import { MyTaskList } from '../../mock-task';
import { TaskService } from '../../services/task.service';
@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})

export class TodoComponent {
  updateId !:any;
  isEditEnabled : boolean = false
  constructor( private fb : FormBuilder, private taskService : TaskService){}

  ngOnInit():void{
    console.log(this.taskService.getTasks())
    this.taskService.getTasks().subscribe((tasksList) => this.tasks = tasksList)
    console.log("got tasks",this.tasks)

    this.todoForm = this.fb.group({
      title : ['' , Validators.required],
      description : ['']
    })
  };
  todoForm ! : FormGroup;
  tasks: ITask[] = [{id:100, title:'hello', description:'helle there hello description',done:false}];
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
    this.tasks.push({
      id:this.tasks.length+1,
      title:this.todoForm.value.title,
      description:this.todoForm.value.description,
      done:false
    })
    this.todoForm.reset()
  };

  deleteTask(i:number,taskGroup:string){
    switch(taskGroup){
      case "To do List":
          this.tasks.splice(i,1)
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
    this.tasks[this.updateId].title = this.todoForm.value.title
    this.tasks[this.updateId].description = this.todoForm.value.description
    this.tasks[this.updateId].done = false
    this.todoForm.reset()
    this.isEditEnabled = false;
    this.updateId = undefined;
  }

  cancelUpdate(){
    this.todoForm.reset()
    this.isEditEnabled = false;
    this.updateId = undefined;
  }

  onDone(i:number, item:ITask){
    this.tasksDone[i].done =  !this.tasksDone[i].done
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
