import { AutoMap } from '@automapper/classes';
import { SeatTypeViewDto } from './seat-type-view.dto';

export class SeatViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  numberSeat: number;

  @AutoMap()
  price: number;

  @AutoMap()
  seatType: SeatTypeViewDto;
}
