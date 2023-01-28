import { AutoMap } from '@automapper/classes';

export class SessionSeatTypeDetailsViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  price: number;

  @AutoMap()
  seatType: string;
}