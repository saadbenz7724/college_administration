import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('classes')
export class Class{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    className: string;

    @Column()
    roomNumber: string;
}