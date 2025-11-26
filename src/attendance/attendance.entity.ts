import { Class } from "src/classes/class.entity";
import { Student } from "src/students/student.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('attendance')
export class Attendance{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: string;

    @Column({default: false})
    present: boolean;

    @ManyToOne(()=> Student, student=>student.attendance, {onDelete: 'CASCADE'})
    student: Student;

    @ManyToOne(()=> Class, cls => cls.attendance, {onDelete: 'CASCADE'})
    class: Class;
}