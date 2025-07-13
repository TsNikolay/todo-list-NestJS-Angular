import { Body, Injectable, NotFoundException, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepo: Repository<Todo>, //Creating instance variable within a constructor. Shortcut
  ) {}

  async create(dto: CreateTodoDto) {
    const todo = this.todoRepo.create({
      ...dto,
      isCompleted: false,
      completeBy: new Date(dto.completeBy), //convert string to Date
    });
    const savedTodo = await this.todoRepo.save(todo);
    return {
      ...savedTodo,
      isExpired: this.checkIfExpired(savedTodo.completeBy),
    };
  }

  async findAll() {
    const todos = await this.todoRepo.find();
    return todos.map((todo) => ({
      ...todo,
      isExpired: this.checkIfExpired(todo.completeBy),
    }));
  }

  async findOne(@Param('id') id: number) {
    const todo = await this.todoRepo.findOneBy({ id: id });
    if (!todo) throw new NotFoundException(`Todo with ID ${id} not found`);
    return { ...todo, isExpired: this.checkIfExpired(todo.completeBy) };
  }

  async update(@Param('id') id: number, @Body() dto: UpdateTodoDto) {
    const todo = await this.todoRepo.preload({
      id,
      ...dto,
      completeBy: dto.completeBy ? new Date(dto.completeBy) : undefined,
    });
    if (!todo) throw new NotFoundException(`Todo with ID ${id} not found`);
    const updatedTodo = await this.todoRepo.save(todo);
    return {
      ...updatedTodo,
      isExpired: this.checkIfExpired(updatedTodo.completeBy),
    };
  }

  async delete(@Param('id') id: number) {
    const result = await this.todoRepo.delete(id);
    if (!result.affected)
      throw new NotFoundException(`Todo with ID ${id} not found`);
  }

  private checkIfExpired(date: Date): boolean {
    return date < new Date();
  }
}
