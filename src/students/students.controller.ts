import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/createStudentDto';
import { UpdateStudentDto } from './dto/updateStudentDto';

@Controller('students')
export class StudentsController {
    constructor(private readonly studentService: StudentsService){}
    @Get()
    getAll(){
        return this.studentService.findAll()
    }

    @Get(':id')
    getOne(@Param('id')id: number){
        return this.studentService.findOne(id)
    }

    @Post()
    create(@Body()createStudentDto: CreateStudentDto){
        return this.studentService.create(createStudentDto)
    }

    @Patch(':id')
    update(@Param('id')id: number, @Body() updateStudentDto: UpdateStudentDto){
        return this.studentService.update(id, updateStudentDto)
    }

    @Delete(':id')
    remove(@Param('id')id: number){
        return this.studentService.remove(id)
    }
}
