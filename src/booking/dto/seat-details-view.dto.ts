import { AutoMap } from '@automapper/classes';

export class SeatDetailsViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  numberSeat: number;

  @AutoMap()
  price: number;

  @AutoMap()
  seatType: string;

  @AutoMap()
  ticketState: string;
}