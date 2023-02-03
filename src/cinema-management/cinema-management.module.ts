import { Module } from '@nestjs/common';
import { CinemaManagementService } from './cinema-management.service';
import { CinemaManagementController } from './cinema-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cinema } from '../database/entity/cinema';
import { CinemaManagementMapperProfile } from './mapper/cinema-management.mapper-profile';
import { Address } from '../database/entity/address';
import { CinemaRepository } from '../database/repository/cinema.repository';

@Module({
  imports: [TypeOrmModule.forFeature([
    Cinema, Address,
  ])],
  controllers: [CinemaManagementController],
  providers: [CinemaManagementMapperProfile, CinemaManagementService, CinemaRepository],
})
export class CinemaManagementModule {
}