import { PartialType } from "@nestjs/mapped-types";
import { CreateStudentDto } from "./createStudentDto";

export class UpdateStudentDto extends PartialType(CreateStudentDto) {}