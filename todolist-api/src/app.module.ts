import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import { TodoModule } from './todo/todo.module';


@Module({
  imports: [TodoModule, TypeOrmModule.forRoot({
    type: "sqlite",
    database: "data.sqlite",
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
