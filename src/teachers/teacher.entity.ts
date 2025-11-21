import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('teachers')
export class Teacher{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({unique: true})
    email: string;
}