import { IsBoolean, IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateTodoDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsDateString()
    completeBy: string;
}
