import { Module } from '@nestjs/common';
import { TeachersController } from './teachers.controller';
import { TeachersService } from './teachers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './teacher.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher])],
  controllers: [TeachersController],
  providers: [TeachersService]
})
export class TeachersModule {}
