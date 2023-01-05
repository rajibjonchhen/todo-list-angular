import { Injectable } from '@angular/core';
import { MyTaskList } from '../mock-task';
import { ITask } from '../components/models/task';
import {Observable, of} from "rxjs"
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor() { }

  getTasks(): Observable<ITask[]>{
    const tasksList = of(MyTaskList)
    return tasksList
  }
}
