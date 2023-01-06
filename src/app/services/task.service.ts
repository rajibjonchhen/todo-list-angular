import { Injectable } from '@angular/core';
import { MyTaskList } from '../mock-task';
import { ITask } from '../components/models/task';
import {Observable, of} from "rxjs"
import { HttpClient, HttpHeaders  } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = "http://localhost:3000/tasks"

  constructor(private http:HttpClient) { }

  getTasksService(): Observable<ITask[]>{
    return this.http.get<ITask[]>(this.apiUrl)
  }
  deleteTaskService(task:ITask): Observable<ITask>{
    const url = `${this.apiUrl}/${task.id}`
    console.log(url, task)
    return this.http.delete<ITask>(url)
  }
  // addTaskService(task:ITask): Observable<ITask>{

  // }


}
