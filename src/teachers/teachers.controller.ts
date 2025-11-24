import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/createTeacherDto';
import { UpdateTeacherDto } from './dto/updateTeacherDto';

@Controller('teachers')
export class TeachersController {
    constructor(private readonly teacherService: TeachersService){}

    @Get()
    getAll(){
        return this.teacherService.findAll();
    }

    @Post(':teacherId/classes/:classId')
    assginClassToTeacher(
        @Param('teacherId') teacherId: number,
        @Param('classId') classId: number,
    ){
        return this.teacherService.assignClassToTeacher(teacherId, classId);
    }

    @Get(':id')
    getOneById(@Param('id')id: number){
        return this.teacherService.findOne(id);
    }

    @Post()
    create(@Body() createTeacherDto: CreateTeacherDto){
        return this.teacherService.create(createTeacherDto);
    }

    @Patch(':id')
    update(@Param('id')id: number, @Body() updateTeacherDto: UpdateTeacherDto){
        return this.teacherService.update(id, updateTeacherDto);
    }

    @Delete(':id')
    remove(@Param('id')id: number){
        return this.teacherService.remove(id);
    }
}
