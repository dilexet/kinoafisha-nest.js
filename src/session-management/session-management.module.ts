import { Module } from '@nestjs/common';
import { SessionManagementService } from './session-management.service';
import { SessionManagementController } from './session-management.controller';
import { SessionManagementMapperProfile } from './mapper/session-management.mapper-profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from '../database/entity/session';
import { SessionSeat } from '../database/entity/session-seat';
import { Movie } from '../database/entity/movie';
import { Hall } from '../database/entity/hall';
import { HallRepository } from '../database/repository/hall.repository';
import { MovieRepository } from '../database/repository/movie.repository';
import { SessionRepository } from '../database/repository/session.repository';
import { SessionSeatRepository } from '../database/repository/session-seat.repository';
import { BookedOrderRepository } from '../database/repository/booked-order.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Hall, Movie,
      Session, SessionSeat,
    ]),
  ],
  controllers: [SessionManagementController],
  providers: [SessionManagementMapperProfile, SessionManagementService,
    HallRepository, MovieRepository, SessionRepository, SessionSeatRepository,
    BookedOrderRepository,
  ],
})
export class SessionManagementModule {
}
