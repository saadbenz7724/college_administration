import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { Student } from './student.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStudentDto } from './dto/createStudentDto';
import { UpdateStudentDto } from './dto/updateStudentDto';
import { Class } from 'src/classes/class.entity';
import Redis from 'ioredis';
import { KafkaService } from 'src/kafka/kafka.service';

@Injectable()
export class StudentsService {
    constructor(
        @InjectRepository(Student)
        private studentRepo: Repository<Student>,
        @InjectRepository(Class)
        private classRepo: Repository<Class>,
        @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
        private readonly kafkaService: KafkaService,
    ){}

    async findAll(page: number = 1, limit = 10){
        const cacheKey = `students:page:${page}:limit:${limit}`
        const cache = await this.redisClient.get(cacheKey);
        if(cache){
            return JSON.parse(cache);
        }
        const [students, total] = await this.studentRepo.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: {id: 'ASC'},
        });

        const result = {
            total,
            page,
            limit,
            totalPages: Math.ceil(total/limit),
            data: students
        };
        await this.redisClient.set(cacheKey, JSON.stringify(result), 'EX', 100);
        return result;
    }

    async findOne(id: number){
        const student = await this.studentRepo.findOne({where:{id}})
        if(!student) throw new NotFoundException(`Student with ID ${id} not found`);
        return student;
    }

    async create(createStudentDto: CreateStudentDto){
        const student = await this.studentRepo.create(createStudentDto)
        await this.redisClient.del('students:page:*');
        const savedStudent = await this.studentRepo.save(student)
        await this.kafkaService.sendMessage(
            'student-created',
            {studentId: savedStudent.id, name: savedStudent.name}
        );
        return savedStudent;
    }

    async update(id: number, updateStudentDto: UpdateStudentDto){
        const student = await this.studentRepo.findOne({where:{id}})
        if(!student) throw new NotFoundException(`Student with ID ${id} not found`);
        await this.studentRepo.update(id, updateStudentDto)
        await this.redisClient.del('students:page:*');
        return {message: 'student updated successfully'}
    }

    async remove(id: number){
        const student = await this.studentRepo.findOne({where: {id}})
        if(!student) throw new NotFoundException(`Student with ID ${id} not found`);
        await this.studentRepo.delete(id)
        await this.redisClient.del('students:page:*');
        return {message: 'Student deleted successfully'}

    }

    async getStudentsWithClass(page: number, limit: number){
        const cacheKey = `students:page:${page}:limit:${limit}`;
        const cache = await this.redisClient.get(cacheKey);
        if(cache) return JSON.parse(cache);
        const [student, total] = await this.studentRepo.findAndCount({
            relations: ['classEntity'],
            skip: (page - 1)*limit,
            take: limit,
            order: {id: 'ASC'},
        });
        const result = {
            page,
            limit,
            total,
            totalPage: Math.ceil(total/limit),
            date: student.map(student=>({
                id: student.id,
                rollNumber: student.rollNumber,
                name: student.name,
                email: student.email,
                age: student.age,
                class: student.classEntity?{
                    id: student.classEntity.id,
                    className: student.classEntity.className,
                    roomNumber: student.classEntity.roomNumber,
                }: null,
            }))
        };
        await this.redisClient.set(cacheKey, JSON.stringify(result), 'EX', 100)
        return result;
    }

    async assignClassToStudents(studentId: number, classId: number){
        const student = await this.studentRepo.findOne({
            where: {id: studentId}
        });
        if(!student) throw new NotFoundException(`Student with ID ${studentId} not found`);
        const cls = await this.classRepo.findOne({where: {id: classId}})
        if(!cls) throw new NotFoundException(`Class with ID ${classId} not found`);
        student.classEntity=cls;
        student.classId=classId;

        await this.redisClient.flushdb();

        return await this.studentRepo.save(student);
    }

    async getStudentClass(id: number){
        const student = await this.studentRepo.findOne({
            where: {id},
            relations: ['classEntity'],
        });
        if(!student) throw new NotFoundException(`Student with ID ${id} not found`);
        return {
            id: student.id,
            rollNumber: student.rollNumber,
            name: student.name,
            email: student.email,
            age: student.age,
            class: student.classEntity?{
                id: student.classEntity.id,
                className: student.classEntity.className,
                roomNumber: student.classEntity.roomNumber,
            }: null,

        };
    }

    async searchStudents(query: string){
        const condition: any[] = [
            {name: Like(`%${query}%`)},
            {email: Like(`%${query}%`)},
        ];
        
        if(!isNaN(Number(query))) condition.push({rollNumber: Number(query)});
        return this.studentRepo.find({
            where: condition
        });
    }

    async getStudentSubjects(id: number){
        const student = await this.studentRepo.findOne({
            where: {id},
            relations: ['classEntity', 'classEntity.subjects']
        });
        if(!student) throw new NotFoundException(`Student with ID ${id} not found`);
        return{
            studentId: student.id,
            studentName: student.name,
            className: student.classEntity.className,
            subjects: student.classEntity.subjects,
        }
    }

    async studentGroupByClass(){
        const cacheKey = 'students:group:classes';
        const cache = await this.redisClient.get(cacheKey);
        if(cache){
            return JSON.parse(cache)
        }
        const student = await this.studentRepo.createQueryBuilder('students').leftJoinAndSelect('students.classEntity', 'class')
                        .select('class.id','classId').addSelect('class.className', 'className')
                        .addSelect('count(students.id)', 'totalStudents').groupBy('class.id').getRawMany();

        await this.redisClient.set(cacheKey, JSON.stringify(student), 'EX', 100)             

        return student;                                      
    }

    async getStudentsWithClassAndTeachers(){
        return this.studentRepo.createQueryBuilder('students').leftJoinAndSelect('students.classEntity', 'classes')
               .leftJoinAndSelect('classes.teachers', 'teachers')
               .select([
                'students.id',
                'students.name',
                'students.email',
                'classes.id',
                'classes.className',
                'teachers.id',
                'teachers.name'
               ]).getMany();
    }

    async getStudentsWithClassAttendance(studentId: number){
        const result =  await this.studentRepo.createQueryBuilder('students').leftJoinAndSelect('students.classEntity', 'classes')
               .leftJoinAndSelect('students.attendance', 'attendance')
               .select([
                'students.id',
                'students.name',
                'students.email',
                'classes.id',
                'classes.className',
                'attendance.id',
                'attendance.present'
               ]).where('students.id = :studentId', {studentId})
               .getOne();

        if(!result) throw new NotFoundException(`Student with ID ${studentId} not found`);
        return result;       
    }
}
