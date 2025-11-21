import { IsNotEmpty, IsString } from "class-validator";

export class CreateClassDto{
    @IsNotEmpty()
    @IsString()
    className: string;

    @IsNotEmpty()
    @IsString()
    roomNumber: string;
}