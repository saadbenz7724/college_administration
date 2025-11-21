import { Class } from "src/classes/class.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('students')
export class Student{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    rollNumber: number;

    @Column()
    name: string;

    @Column({unique: true})
    email: string;

    @Column()
    age: number;

    @ManyToOne(()=> Class, (cls)=>cls.students, {onDelete: 'SET NULL'})
    @JoinColumn({name: 'classId'})
    classEntity: Class;

    @Column({nullable: true})
    classId: number;

}