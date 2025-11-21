import { PartialType } from "@nestjs/mapped-types";
import { CreateSubjectDto } from "./createSubjectDto";

export class UpdateSubjectDto extends PartialType(CreateSubjectDto){}