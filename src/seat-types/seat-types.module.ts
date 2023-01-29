import { Module } from '@nestjs/common';
import { SeatTypesService } from './seat-types.service';
import { SeatTypesController } from './seat-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatTypesMapperProfile } from './mapper/seat-types.mapper-profile';
import { SeatType } from '../database/entity/seat-type';
import { SeatTypeRepository } from '../database/repository/seat-type.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SeatType])],
  controllers: [SeatTypesController],
  providers: [SeatTypesMapperProfile, SeatTypesService, SeatTypeRepository],
})
export class SeatTypesModule {
}
