import { AutoMap } from '@automapper/classes';
import { RowViewDto } from './row-view.dto';

export class HallViewDetailsDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap()
  cinemaId: string;

  @AutoMap()
  cinemaName: string;

  @AutoMap()
  rows: RowViewDto[];
}
