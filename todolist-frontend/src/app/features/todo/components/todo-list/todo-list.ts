import { Component, computed, inject } from '@angular/core';
import { TodoItem } from '../todo-item/todo-item';
import { TodoStore } from '../../store/todo.store';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [TodoItem],
  templateUrl: './todo-list.html',
  styleUrl: './todo-list.css',
})
export class TodoList {
  readonly store = inject(TodoStore);
  todos = computed(() => this.store.todos());
}
