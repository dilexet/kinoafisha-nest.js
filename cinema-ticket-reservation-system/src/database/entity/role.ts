import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import {User} from './user';

@Entity()
export class Role {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @OneToMany(() => User, user => user.role)
    users: User[];
}