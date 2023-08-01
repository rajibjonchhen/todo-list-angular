import { Injectable } from '@angular/core';
import { MyTaskList } from '../mock-task';
import { ITask } from '../components/models/task';
import {Observable, of} from "rxjs"
import { HttpClient, HttpHeaders  } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':'application/json',
  })
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = "http://localhost:4200/tasks"

  constructor(private http:HttpClient) { }

// ***************** get all tasks **************************
getTasksService(): Observable<ITask[]>{
  return this.http.get<ITask[]>(this.apiUrl)
}

// ***************** add new task **************************
addTasksService(task:ITask): Observable<ITask>{
  console.log("hello tas")
  return this.http.post<ITask>(this.apiUrl, task, httpOptions)
}

// ***************** delete a task **************************
deleteTaskService(task:ITask): Observable<ITask>{
  const url = `${this.apiUrl}/${task.id}`
  return this.http.delete<ITask>(url)
}

// ***************** update a task **************************
  updateTaskService(task:ITask): Observable<ITask>{
    console.log("task", task)
    const url = `${this.apiUrl}/${task.id}`
    return this.http.put<ITask>(url, task, httpOptions)
  }
}
