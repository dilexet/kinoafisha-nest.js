import { AutoMap } from '@automapper/classes';
import { BookedSeatViewDto } from './booked-seat-view.dto';

export class UserBookedOrderViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  movieName: string;

  @AutoMap()
  moviePosterURL: string;

  @AutoMap()
  cinemaName: string;

  @AutoMap()
  address: string;

  @AutoMap()
  hallName: string;

  @AutoMap()
  totalPrice: number;

  @AutoMap()
  startDate: string;

  @AutoMap()
  endDate: string;

  @AutoMap()
  seats: BookedSeatViewDto[];
}
