import { AutoMap } from '@automapper/classes';

export class SessionSeatViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  ticketState: string;

  @AutoMap()
  seatId: string;

  @AutoMap()
  numberSeat: number;

  @AutoMap()
  numberRow: number;

  @AutoMap()
  price: number;

  @AutoMap()
  seatType: string;
}
