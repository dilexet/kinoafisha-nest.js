import { Module } from '@nestjs/common';
import { HallManagementService } from './hall-management.service';
import { HallManagementController } from './hall-management.controller';
import { HallManagementMapperProfile } from './mapper/hall-management.mapper-profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hall } from '../database/entity/hall';
import { Row } from '../database/entity/row';
import { Seat } from '../database/entity/seat';
import { SeatType } from '../database/entity/seat-type';
import { Cinema } from '../database/entity/cinema';
import { CinemaRepository } from '../database/repository/cinema.repository';
import { HallRepository } from '../database/repository/hall.repository';
import { RowRepository } from '../database/repository/row.repository';
import { SeatRepository } from '../database/repository/seat.repository';
import { SeatTypeRepository } from '../database/repository/seat-type.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cinema, Hall, Row, Seat, SeatType,
    ]),
  ],
  controllers: [HallManagementController],
  providers: [HallManagementService, HallManagementMapperProfile,
    CinemaRepository, HallRepository,
    RowRepository, SeatRepository, SeatTypeRepository,
  ],
})
export class HallManagementModule {
}
