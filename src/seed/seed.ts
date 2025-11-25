import * as dotenv from 'dotenv';
dotenv.config();
import { Class } from "src/classes/class.entity";
import { Student } from "src/students/student.entity";
import { Course } from "src/subjects/subject.entity";
import { Teacher } from "src/teachers/teacher.entity";
import { DataSource } from "typeorm";
import {faker} from '@faker-js/faker'

const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Class, Student, Teacher, Course],
    synchronize: true,
});

async function seed(){
    try{
        await AppDataSource.initialize();
        console.log('DB connected for seeding');

        const classRepo = AppDataSource.getRepository(Class);
        const studentRepo = AppDataSource.getRepository(Student);
        const teacherRepo = AppDataSource.getRepository(Teacher);
        const subjectRepo = AppDataSource.getRepository(Course);

        const classes: Class[] = [];
        for (let i = 1; i <= 10; i++) {
            const cls = classRepo.create({
                className: `Class ${i}`,
                roomNumber: `Room ${100 + i}`,
            });
            classes.push(await classRepo.save(cls));
        }
        console.log('classes added')

        
        const teachers: Teacher[] = [];
        for (let i = 1; i <= 20; i++) {
            const teacher = teacherRepo.create({
                name: faker.person.fullName(),
                email: faker.internet.email(),
            });

            teachers.push(await teacherRepo.save(teacher));
        }
        console.log('teachers added');

        const cls = await classRepo.find();
        const tea = await teacherRepo.find();

        const subjects: Course[] = [];
        for (let i = 1; i <= 20; i++) {
             const randomClass = cls[Math.floor(Math.random() * cls.length)];
            const randomTeacher = tea[Math.floor(Math.random() * tea.length)];
            const sub = subjectRepo.create({
                subjectName: `Subject ${i}`,
                classes: randomClass,
                teacher: randomTeacher,
            });
            subjects.push(await subjectRepo.save(sub));
        }
        console.log('subjects added');

        const students: Student[] = []
        for(let i = 1; i <= 200; i++){
            const student = studentRepo.create({
                rollNumber: 112500 + i,
                name: faker.person.fullName(),
                email: faker.internet.email(),
                age: faker.number.int({min: 12, max: 22}),
                classEntity: faker.helpers.arrayElement(classes),
            });
            students.push(await studentRepo.save(student));
        }
        console.log('students added')
        console.log('seeding completed successfully')
        process.exit()
    }catch(err){
        console.error('error while seeding', err);
        process.exit(1);
    }
}
seed();