import { Module } from '@nestjs/common';
import { SessionManagementService } from './session-management.service';
import { SessionManagementController } from './session-management.controller';
import { SessionManagementMapperProfile } from './mapper/session-management.mapper-profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from '../database/entity/session';
import { SessionSeat } from '../database/entity/session-seat';
import { Movie } from '../database/entity/movie';
import { Hall } from '../database/entity/hall';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Hall, Movie,
      Session, SessionSeat,
    ]),
  ],
  controllers: [SessionManagementController],
  providers: [SessionManagementMapperProfile, SessionManagementService],
})
export class SessionManagementModule {
}
