import { AutoMap } from '@automapper/classes';
import { MovieDetailsViewDto } from './movie-details-view.dto';
import { HallDetailsViewDto } from './hall-details-view.dto';
import { SessionSeatTypeDetailsViewDto } from './session-seat-type-details-view.dto';

export class SessionDetailsViewDto {
  @AutoMap()
  id: string;

  @AutoMap()
  startDate: Date;

  @AutoMap()
  endDate: Date;

  @AutoMap()
  coefficient: number;

  @AutoMap()
  hallWorkLoad: number;

  @AutoMap()
  movie: MovieDetailsViewDto;

  @AutoMap()
  hall: HallDetailsViewDto;

  @AutoMap()
  sessionSeatTypes: SessionSeatTypeDetailsViewDto[];
}