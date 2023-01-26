import { AutoMap } from '@automapper/classes';
import { RowViewDto } from './row-view.dto';

export class HallViewDto {
  @AutoMap()
  id: string;

  cinemaId: string;
  cinemaName: string;

  @AutoMap()
  name: string;

  @AutoMap()
  rows: RowViewDto[];
}
