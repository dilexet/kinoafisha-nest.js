import { AutoMap } from '@automapper/classes';
import { SeatViewDto } from './seat-view.dto';

export class RowViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  numberRow: number;

  @AutoMap()
  seats: SeatViewDto[];
}
