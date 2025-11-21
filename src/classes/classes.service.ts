import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Class } from './class.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClassesService {
    constructor(
        @InjectRepository(Class)
        private classRepo: Repository<Class>,
    ){}

    async findAll(){
        return this.classRepo.find()
    }

    async findOne(id: number){
        const cls = await this.classRepo.findOne({where: {id}})
        if(!cls) throw new NotFoundException(`Class with ID ${id} not found`);
        return cls;
    }

    async create(body: any){
        const cls = this.classRepo.create(body);
        return this.classRepo.save(cls);
    }

    async update(id: number, body: any){
        const cls = await this.classRepo.findOne({where: {id}})
        if(!cls) throw new NotFoundException(`Class with ID ${id} not found`);
        await this.classRepo.update(id, body)
        return {message: 'Class updated successfully'}
    }

    async remove(id: number){
        const cls = await this.classRepo.findOne({where: {id}})
        if(!cls) throw new NotFoundException(`Class with ID ${id} not found`);
        await this.classRepo.delete(id)
        return {message: 'Class deleted successfully'}
    }
}
