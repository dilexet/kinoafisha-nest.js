import { SessionViewDto } from './session-view.dto';
import { SessionSeatViewDto } from './session-seat-view.dto';
import { AutoMap } from '@automapper/classes';

export class SessionDetailsViewDto {
  @AutoMap()
  sessionData: SessionViewDto;

  @AutoMap()
  sessionSeats: SessionSeatViewDto[];
}
