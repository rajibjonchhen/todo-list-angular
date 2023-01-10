import { Component, Input } from '@angular/core';
import { ITask } from '../models/task';
import { ITodos } from '../models/todos';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css']
})
export class TaskItemComponent {
@Input() task:ITask
@Input() todo:ITodos
@Input() i:number|string
}
