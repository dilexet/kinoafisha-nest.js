import { AutoMap } from '@automapper/classes';
import { CinemaViewDto } from './cinema-view.dto';
import { SessionViewDto } from './session-view.dto';

export class CinemaSessionsViewDto {
  @AutoMap()
  cinema: CinemaViewDto;

  @AutoMap()
  sessions: SessionViewDto[];
}