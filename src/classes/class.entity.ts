import { Student } from "src/students/student.entity";
import { Teacher } from "src/teachers/teacher.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('classes')
export class Class{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    className: string;

    @Column()
    roomNumber: string;

    @OneToMany(()=> Student, (student)=> student.classEntity)
    students: Student[];

    @ManyToMany(()=> Teacher, (teacher)=>teacher.classes)
    teachers: Teacher[];

}