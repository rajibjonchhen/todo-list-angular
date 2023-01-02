import { ITask } from "./task";

export interface ITodos{
  todosTitle : string,
  titleIcon : string,
  todosTask : ITask[],
  addTaskFunc? : Function,
  editFunc?: Function,
  deleteFunc: Function,
}
