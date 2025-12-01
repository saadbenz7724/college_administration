import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './student.entity';
import { Class } from 'src/classes/class.entity';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Class]),
  KafkaModule,
],
  controllers: [StudentsController],
  providers: [StudentsService]
})
export class StudentsModule {}
