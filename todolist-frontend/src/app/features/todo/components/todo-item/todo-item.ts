import { Component, inject, input } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { DatePipe, NgClass } from '@angular/common';
import { TodoStore } from '../../store/todo.store';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  standalone: true,
  selector: '[app-todo-item]',
  imports: [DatePipe, NgClass, MatIcon, MatTooltip],
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.css',
})
export class TodoItem {
  todo = input.required<Todo>();
  readonly store = inject(TodoStore);
}
