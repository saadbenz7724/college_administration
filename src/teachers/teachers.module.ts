import { Module } from '@nestjs/common';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './teacher.entity';
import { Class } from 'src/classes/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher, Class])],
  controllers: [TeachersController],
  providers: [TeachersService]
})
export class TeachersModule {}
