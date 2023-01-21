import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import SeatTypesEnum from '../../shared/enums/seat-types.enum';
import { Row } from './row';

@Entity()
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  numberSeat: number;

  @Column({
    type: 'enum',
    enum: SeatTypesEnum,
    default: SeatTypesEnum.Regular,
  })
  seatType: SeatTypesEnum;

  @Column()
  price: number;

  @ManyToOne(() => Row, row => row.seats)
  row: Row;
}