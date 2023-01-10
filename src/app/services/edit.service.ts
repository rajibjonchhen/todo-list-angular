import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs'
import { ITask } from '../components/models/task';

@Injectable({
  providedIn: 'root'
})
export class EditService {
private taskEditable : boolean = false;
private tasktoEdit : ITask|null = null;
private subject = new Subject<any>()
  constructor() { }

  getTaskToEdit(task:ITask):void{
    this.taskEditable = !this.taskEditable
    this.tasktoEdit = {...task}
    this.subject.next({taskToEdit:this.tasktoEdit, taskEditable:this.taskEditable})
  }

  onGetTaskToEdit(): Observable<any>{
    return this.subject.asObservable()
  }
}
