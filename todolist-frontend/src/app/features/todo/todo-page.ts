import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { TodoList } from './components/todo-list/todo-list';
import { TodoService } from './services/todo.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TodoStore } from './store/todo.store';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'dd.MM.yyyy',
  },
  display: {
    dateInput: 'dd.MM.yyyy',
    monthYearLabel: 'MMM yyyy',
    dateA11yLabel: 'dd.MM.yyyy',
    monthYearA11yLabel: 'MMMM yyyy',
  },
};

@Component({
  standalone: true,
  selector: 'app-todo-page',
  imports: [
    TodoList,
    ReactiveFormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIcon,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
  templateUrl: './todo-page.html',
  styleUrl: './todo-page.css',
})
export class TodoPage implements OnInit {
  readonly store = inject(TodoStore);
  readonly editing = computed(() => this.store.editingTodo());
  readonly form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    completeBy: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });
  readonly formSyncEffect = effect(() => {
    const editing = this.editing();

    if (editing) {
      this.form.patchValue({
        title: editing.title,
        completeBy: editing.completeBy,
      });
    } else {
      this.form.reset();
    }
  });

  constructor(
    private todoService: TodoService,
    private adapter: DateAdapter<Date>,
  ) {
    this.adapter.setLocale('en-GB');
  }

  ngOnInit(): void {
    this.todoService.getTodos().subscribe((data) => {
      this.store.todos.set(data);
    });
  }

  addTodo() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { title, completeBy } = this.form.value;
    if (title && completeBy) {
      this.store.add(title, completeBy);
      this.form.reset();
    }
  }

  updateTodo() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // 🔁 показывает ошибки
      return;
    }
    const { title, completeBy } = this.form.value;
    if (title && completeBy) {
      this.store.saveEdited(title, completeBy);
    }
  }

  cancelEdit() {
    this.store.cancelEdit();
  }

  hasCompleteBy(): boolean {
    return !!this.form.get('completeBy')?.value;
  }

  clearDate() {
    this.form.get('completeBy')?.setValue('');
  }
}
