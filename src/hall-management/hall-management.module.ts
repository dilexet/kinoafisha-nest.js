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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cinema, Hall, Row, Seat, SeatType,
    ])
  ],
  controllers: [HallManagementController],
  providers: [HallManagementService, HallManagementMapperProfile],
})
export class HallManagementModule {
}
