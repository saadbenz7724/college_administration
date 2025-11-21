import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ClassesService } from './classes.service';

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
    create(@Body()body: any){
        return this.classService.create(body)
    }

    @Patch(':id')
    update(@Param('id')id: number, @Body()body: any){
        return this.classService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id')id: number){
        return this.classService.remove(id);
    }
}
