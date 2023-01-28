import { AutoMap } from '@automapper/classes';
import { BookedSeatViewDto } from './booked-seat-view.dto';

export class UserBookedOrderViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  totalPrice: number;

  @AutoMap()
  seats: BookedSeatViewDto[];
}
