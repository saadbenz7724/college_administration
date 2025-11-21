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
}