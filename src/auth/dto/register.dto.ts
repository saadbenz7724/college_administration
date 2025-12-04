import { IsEmail, IsEnum, IsString, MinLength } from "class-validator";
import { UserRole } from "src/users/user.entity";

export class RegisterDto{
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @MinLength(6)
    password: string;

    @IsEnum(UserRole)
    role: UserRole;
}