import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TeachersService } from './teachers.service';

@Controller('teachers')
export class TeachersController {
    constructor(private readonly teacherService: TeachersService){}

    @Get()
    getAll(){
        return this.teacherService.findAll();
    }

    @Get(':id')
    getOneById(@Param('id')id: number){
        return this.teacherService.findOne(id);
    }

    @Post()
    create(@Body()body: any){
        return this.teacherService.create(body);
    }

    @Patch(':id')
    update(@Param('id')id: number, @Body()body: any){
        return this.teacherService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id')id: number){
        return this.teacherService.remove(id);
    }
}
