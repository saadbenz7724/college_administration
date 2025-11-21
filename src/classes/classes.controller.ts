import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/createClassDto';
import { UpdateClassDto } from './dto/updateClassDto';

@Controller('classes')
export class ClassesController {
    constructor(private readonly classService: ClassesService){}

    @Get()
    findAll(){
        return this.classService.findAll();
    }

    @Get(':id')
    findOne(@Param('id')id: number){
        return this.classService.findOne(id)
    }

    @Post()
    create(@Body() createClassDto: CreateClassDto){
        return this.classService.create(createClassDto)
    }

    @Patch(':id')
    update(@Param('id')id: number, @Body() updateClassDto: UpdateClassDto){
        return this.classService.update(id, updateClassDto);
    }

    @Delete(':id')
    remove(@Param('id')id: number){
        return this.classService.remove(id);
    }
}
