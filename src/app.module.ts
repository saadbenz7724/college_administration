import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from './students/students.module';
import { ClassesModule } from './classes/classes.module';
import { TeachersModule } from './teachers/teachers.module';
import { SubjectsModule } from './subjects/subjects.module';
import { AttendanceModule } from './attendance/attendance.module';
import { RedisModule } from './redis/redis.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './logger/winston.config';
import { CronModule } from './cron/cron.module';
import { ScheduleModule } from '@nestjs/schedule';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    WinstonModule.forRoot(winstonConfig),
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    StudentsModule,
    ClassesModule,
    TeachersModule,
    SubjectsModule,
    AttendanceModule,
    RedisModule,
    CronModule,
  ],
  
})
export class AppModule {}
