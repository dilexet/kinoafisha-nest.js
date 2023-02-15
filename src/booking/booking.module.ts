import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { BookTicketsMapperProfile } from './mapper/book-tickets.mapper-profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from '../database/entity/session';
import { BookedOrder } from '../database/entity/booked-order';
import { SessionRepository } from '../database/repository/session.repository';
import { BookedOrderRepository } from '../database/repository/booked-order.repository';
import { SessionSeat } from '../database/entity/session-seat';
import { SessionSeatRepository } from '../database/repository/session-seat.repository';
import { UserProfile } from '../database/entity/user-profile';
import { UserProfileRepository } from '../database/repository/user-profile.repository';
import { MovieRepository } from '../database/repository/movie.repository';
import { MoviePopularityService } from '../shared/utils/movie-popularity-service';
import { BookingGateway } from './booking.gateway';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session, BookedOrder, UserProfile, SessionSeat]),
  ],
  controllers: [BookingController],
  providers: [
    BookingGateway,
    MailService,
    BookTicketsMapperProfile,
    BookingService,
    MovieRepository,
    MoviePopularityService,
    SessionRepository,
    BookedOrderRepository,
    UserProfileRepository,
    SessionSeatRepository,
  ],
})
export class BookingModule {
}
