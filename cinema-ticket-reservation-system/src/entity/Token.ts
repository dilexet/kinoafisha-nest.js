import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Token {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    refreshToken: string;

    @ManyToOne(() => User, user => user.tokens)
    user: User;
}
