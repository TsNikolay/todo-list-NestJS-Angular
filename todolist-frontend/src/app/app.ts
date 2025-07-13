import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TodoPage} from "./features/todo/todo-page";

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [TodoPage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('todolist-frontend');
}
