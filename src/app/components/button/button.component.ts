import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
@Input() text:string;
@Input() color:string;
@Input() icon:string;
@Input() isDisable:boolean;
@Output() btnClicked = new EventEmitter();

onClick(){
  this. btnClicked.emit()
}
}
