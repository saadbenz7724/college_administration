import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { StudentsService } from './students.service';

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
    create(@Body()body: any){
        return this.studentService.create(body)
    }

    @Patch(':id')
    update(@Param('id')id: number, @Body()body: any){
        return this.studentService.update(id, body)
    }

    @Delete(':id')
    remove(@Param('id')id: number){
        return this.studentService.remove(id)
    }
}
