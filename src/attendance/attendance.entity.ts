import { Class } from "src/classes/class.entity";
import { Student } from "src/students/student.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('attendance')
export class Attendance{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'date'})
    date: Date;

    @Column({default: false})
    present: boolean;

    @ManyToOne(()=> Student, student=>student.attendance, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'studentId'})
    student: Student;

    @ManyToOne(()=> Class, cls => cls.attendance, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'classId'})
    classEntity: Class;
}