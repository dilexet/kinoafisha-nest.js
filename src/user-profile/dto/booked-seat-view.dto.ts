import { AutoMap } from '@automapper/classes';

export class BookedSeatViewDto {
  @AutoMap()
  sessionSeatId: string;

  @AutoMap()
  numberSeat: number;

  @AutoMap()
  numberRow: number;

  @AutoMap()
  seatType: string;

  @AutoMap()
  price: number;
}
