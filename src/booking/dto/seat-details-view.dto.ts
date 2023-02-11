import { AutoMap } from '@automapper/classes';

export class SeatDetailsViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  sessionSeatId: string;

  @AutoMap()
  numberSeat: number;

  @AutoMap()
  price: number;

  @AutoMap()
  seatType: string;

  @AutoMap()
  seatTypeId: string;

  @AutoMap()
  ticketState: string;
}