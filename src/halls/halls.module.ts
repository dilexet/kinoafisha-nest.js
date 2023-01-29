import { Module } from '@nestjs/common';
import { HallsService } from './halls.service';
import { HallsController } from './halls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HallsMapperProfile } from './mapper/halls.mapper-profile';
import { CinemaRepository } from '../database/repository/cinema.repository';
import { Cinema } from '../database/entity/cinema';

@Module({
  imports: [TypeOrmModule.forFeature([Cinema])],
  controllers: [HallsController],
  providers: [HallsMapperProfile, HallsService, CinemaRepository],
})
export class HallsModule {
}
