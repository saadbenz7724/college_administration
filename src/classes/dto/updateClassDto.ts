import { PartialType } from "@nestjs/mapped-types";
import { CreateClassDto } from "./createClassDto";

export class UpdateClassDto extends PartialType(CreateClassDto){}