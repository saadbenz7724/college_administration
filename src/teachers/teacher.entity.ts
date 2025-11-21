import { Class } from "src/classes/class.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('teachers')
export class Teacher{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({unique: true})
    email: string;

    @ManyToMany(()=>Class, (cls)=>cls.teachers)
    @JoinTable({
        name: 'teacher_classes',
        joinColumn: {name: 'teacherId', referencedColumnName: 'id'},
        inverseJoinColumn: {name: 'classId', referencedColumnName: 'id'}
    })
    classes: Class[]
}