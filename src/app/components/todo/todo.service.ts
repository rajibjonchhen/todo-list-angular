import { Injectable } from "@angular/core";
import { ITask } from '../models/task';
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { TaskService } from "src/app/services/task.service";

@Injectable({providedIn:'root'})

export class TodoTaskService{
  private tasks : ITask[] = [];
  private taskUpdated = new Subject<ITask[]>();

  constructor( private http : HttpClient){}

  getUpdateListener(){
    return this.taskUpdated.asObservable()
  }

  addTask(task:ITask){

  }
  getTasks(){
    this.http
  }
}
