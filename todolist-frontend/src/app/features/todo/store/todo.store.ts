import { Injectable, signal } from '@angular/core';
import { Todo } from '../models/todo.model';
import { TodoService } from '../services/todo.service';

@Injectable({ providedIn: 'root' })
export class TodoStore {
  todos = signal<Todo[]>([]);
  editingTodo = signal<Todo | null>(null);
  private toggleTimeouts = new Map<number, any>();

  constructor(private todoService: TodoService) {}

  add(title: string, completeBy: string) {
    if (title && completeBy) {
      this.todoService.createTodo({ title, completeBy }).subscribe({
        next: (newTodo) => {
          this.todos.update((prev) => [...prev, newTodo]);
        },
        error: (err) => {
          console.error('Failed to add todo:', err);
        },
      });
    }
  }

  startEdit(todo: Todo) {
    this.editingTodo.set(todo);
  }

  cancelEdit() {
    this.editingTodo.set(null);
  }

  saveEdited(title: string, completeBy: string) {
    const current = this.editingTodo();
    if (!current) return;

    const updated: Todo = { ...current, title, completeBy };

    this.todoService.updateTodo(updated).subscribe((serverTodo) => {
      this.todos.update((prev) =>
        prev.map((todo) => (todo.id === serverTodo.id ? serverTodo : todo)),
      );
      this.editingTodo.set(null);
    });
  }

  delete(id: number) {
    this.todoService.deleteTodo(id).subscribe({
      next: () => {
        this.todos.update((prev) => prev.filter((t) => t.id !== id));
      },
      error: () => {
        console.error(`Failed to delete todo with id = ${id}`);
      },
    });
  }

  toggle(id: number) {
    //Local changes
    this.todos.update((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo,
      ),
    );

    //Timeout before sending to the backend
    clearTimeout(this.toggleTimeouts.get(id));
    const timeout = setTimeout(() => {
      const updated = this.todos().find((t) => t.id === id);
      if (updated) {
        this.todoService.updateTodo(updated).subscribe({
          error: (err) => {
            console.error('Failed to update todo status:', err);
          },
        });
      }
    }, 3000);

    this.toggleTimeouts.set(id, timeout);
  }

  edit(id: number, newTitle: string) {
    this.todos.update((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, title: newTitle } : todo,
      ),
    );
  }
}
