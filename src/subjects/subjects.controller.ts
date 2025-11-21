import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/createSubjectDto';

@Controller('subjects')
export class SubjectsController {
    constructor(
        private readonly subjectService: SubjectsService
    ){}

    @Post()
    create(@Body() createSubjectDto: CreateSubjectDto){
        return this.subjectService.create(createSubjectDto);
    }

    @Get()
    getAll(){
        return this.subjectService.findAll();
    }
    @Get(':id')
    getOne(@Param('id')id: number){
        return this.subjectService.findOne(id)
    }

    @Patch(':id')
    update(@Param('id')id: number, @Body() createSubjectDto: CreateSubjectDto){
        return this.subjectService.update(id, createSubjectDto);
    }

    @Delete(':id')
    remove(@Param('id')id: number){
        return this.subjectService.remove(id)
    }
}
