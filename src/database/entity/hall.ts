import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Cinema } from './cinema';
import { Row } from './row';
import { AutoMap } from '@automapper/classes';
import { Session } from './session';
import { BaseEntity } from './base-entity';

@Entity()
export class Hall extends BaseEntity {
  @Column()
  @AutoMap()
  name: string;

  @ManyToOne(() => Cinema, (cinema) => cinema.halls, { onDelete: 'CASCADE' })
  cinema: Cinema;

  @OneToMany(() => Session, (session) => session.hall)
  @AutoMap()
  sessions: Session[];

  @OneToMany(() => Row, (row) => row.hall, { cascade: true })
  @AutoMap(() => Row)
  rows: Row[];
}
