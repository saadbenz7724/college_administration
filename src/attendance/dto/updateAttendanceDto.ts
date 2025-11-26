import { PartialType } from "@nestjs/mapped-types";
import { CreateAttendanceDto } from "./createAttendanceDto";

export class UpdateAttendanceDto extends PartialType(CreateAttendanceDto){}