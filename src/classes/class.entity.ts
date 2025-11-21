import { Student } from "src/students/student.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

}