import { AutoMap } from '@automapper/classes';

export class BookedOrderViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  totalPrice: number;

  @AutoMap()
  numberOfTickets: number;
}