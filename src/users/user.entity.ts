import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole{
    ADMIN = 'admin',
    TEACHER = 'teacher',
    STUDENT = 'student'
}

@Entity('users')
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.STUDENT
    })
    role: UserRole;

    @Column()
    name: string;
}