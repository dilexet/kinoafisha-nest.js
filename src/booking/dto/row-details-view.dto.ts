import { AutoMap } from '@automapper/classes';
import { SeatDetailsViewDto } from './seat-details-view.dto';

export class RowDetailsViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  numberRow: number;

  @AutoMap()
  seats: SeatDetailsViewDto[];
}
