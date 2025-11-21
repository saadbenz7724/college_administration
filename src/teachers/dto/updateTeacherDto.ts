import { PartialType } from "@nestjs/mapped-types";
import { CreateTeacherDto } from "./createTeacherDto";

export class UpdateTeacherDto extends PartialType(CreateTeacherDto){}