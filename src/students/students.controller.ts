import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
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

    @Get('search')
    searchStudent(
        @Query('query')query: string
    ){
        return this.studentService.searchStudents(query)
    }

    @Get(':id/class')
    getStudentClass(@Param('id')id: number){
        return this.studentService.getStudentClass(id);
    }

    @Get('with-class')
    getStudentsWithClass(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
    ){
        const pageNumber = Number(page);
        const pageLimit = Number(limit);
        return this.studentService.getStudentsWithClass(pageNumber, pageLimit);
    }

    @Get(':id')
    getOne(@Param('id')id: number){
        return this.studentService.findOne(id)
    }

    @Post()
    create(@Body()createStudentDto: CreateStudentDto){
        return this.studentService.create(createStudentDto)
    }

    @Patch(':studentId/class/:classId')
    assignClassToStudent(
        @Param('studentId')studentId: number,
        @Param('classId')classId: number,
    ){
        return this.studentService.assignClassToStudents(studentId, classId)
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
