import { Module } from '@nestjs/common';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './subject.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  controllers: [SubjectsController],
  providers: [SubjectsService]
})
export class SubjectsModule {}
