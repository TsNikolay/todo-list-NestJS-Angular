import {Controller, Get, Post, Put, Param, Delete, Body, ParseIntPipe} from '@nestjs/common';
import {TodoService} from "./todo.service";
import {CreateTodoDto} from "./dto/create-todo.dto";
import {UpdateTodoDto} from "./dto/update-todo.dto";

@Controller('todos')
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    @Post()
    create(@Body() dto:CreateTodoDto){
        return this.todoService.create(dto)
    }

    @Get()
    findAll(){
        return this.todoService.findAll()
    }

    @Get(":id")
    findOne(@Param('id') id:number){
        return this.todoService.findOne(id)
    }

    @Put(":id")
    update(@Param('id') id: number, @Body() dto: UpdateTodoDto ){
        return this.todoService.update(id,dto)
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id:number){
        return this.todoService.delete(id)
    }
}
