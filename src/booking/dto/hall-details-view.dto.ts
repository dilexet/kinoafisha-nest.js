import { AutoMap } from '@automapper/classes';
import { RowDetailsViewDto } from './row-details-view.dto';

export class HallDetailsViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;

  @AutoMap()
  cinemaName: string;

  @AutoMap()
  address: string;

  @AutoMap()
  rows: RowDetailsViewDto[];
}