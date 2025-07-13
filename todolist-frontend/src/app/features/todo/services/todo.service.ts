import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "../../../../environments/environments";
import {Todo} from "../models/todo.model";

@Injectable({
  providedIn: 'root'
})

export class TodoService {
  private readonly baseUrl = environment.apiUrl

  constructor(private http: HttpClient) {
  }

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>(`${this.baseUrl}/todos`);
  }

  createTodo(todo: Omit<Todo, "id" | "isCompleted" | "isExpired">): Observable<Todo> {
    return this.http.post<Todo>(`${this.baseUrl}/todos`, todo)
  }
  
  updateTodo(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.baseUrl}/todos/${todo.id}`, todo);
  }

  deleteTodo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/todos/${id}`);
  }
}
