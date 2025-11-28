import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Attendance } from "src/attendance/attendance.entity";
import { CronService } from "./cron.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Attendance]),
    ],
    providers: [CronService]
})
export class CronModule{}