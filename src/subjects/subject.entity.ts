import { Class } from "src/classes/class.entity";
import { Teacher } from "src/teachers/teacher.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('subjects')
export class Course{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    subjectName: string;
    
    @ManyToOne(()=>Class, (cls)=>cls.subjects, {onDelete: 'CASCADE'})
    @JoinColumn({
        name: 'classId'
    })
    classes: Class;

    @ManyToOne(()=> Teacher, (teacher)=> teacher.subjects, {onDelete: 'SET NULL'})
    @JoinColumn({name: 'teacherId'})
    teacher: Teacher;

}