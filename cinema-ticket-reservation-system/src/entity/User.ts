import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Role } from './Role';
import { Token } from './Token';
import { AutoMap } from '@automapper/classes';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @AutoMap()
    @Column()
    name: string;

    @AutoMap()
    @Column()
    email: string;

    @Column()
    passwordHash: string;

    @Column({ default: false })
    isActivated: boolean;

    @Column()
    activationLink: string;

    @ManyToOne(() => Role, role => role.users)
    role: Role;

    @OneToMany(() => Token, token => token.user)
    tokens: Token[];
}
