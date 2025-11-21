import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTeacherDto{
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsOptional()
    @IsNumber({}, {each: true})
    classIds?: number[];
}