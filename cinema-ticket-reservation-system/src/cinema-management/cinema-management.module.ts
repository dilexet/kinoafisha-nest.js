import { Module } from '@nestjs/common';
import { CinemaManagementService } from './cinema-management.service';
import { CinemaManagementController } from './cinema-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cinema } from '../database/entity/cinema';
import { SeatType } from '../database/entity/seat-type';
import { Row } from '../database/entity/row';
import { Seat } from '../database/entity/seat';
import { Hall } from '../database/entity/hall';
import { CinemaManagementMapperProfile } from './mapper/cinema-management.mapper-profile';
import { Address } from '../database/entity/address';

@Module({
  imports: [TypeOrmModule.forFeature([
    Cinema, Hall, Row, Seat, SeatType, Address,
  ])],
  controllers: [CinemaManagementController],
  providers: [CinemaManagementMapperProfile, CinemaManagementService],
})
export class CinemaManagementModule {
}