import {IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString} from "class-validator";

export class UpdateTodoDto{
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsBoolean()
    isCompleted: boolean;

    @IsOptional()
    @IsDateString()
    completeBy: string;
}