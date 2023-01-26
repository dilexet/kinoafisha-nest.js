import { Module } from '@nestjs/common';
import { CinemasService } from './cinemas.service';
import { CinemasController } from './cinemas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CinemasMapperProfile } from './mapper/cinemas.mapper-profile';
import { CinemaRepository } from '../database/repository/cinema.repository';
import { Cinema } from '../database/entity/cinema';

@Module({
  imports: [TypeOrmModule.forFeature([Cinema])],
  controllers: [CinemasController],
  providers: [CinemasMapperProfile, CinemasService, CinemaRepository],
})
export class CinemasModule {
}
