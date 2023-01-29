import { Module } from '@nestjs/common';
import { GenresService } from './genres.service';
import { GenresController } from './genres.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genre } from '../database/entity/genre';
import { GenresMapperProfile } from './mapper/genres.mapper-profile';

@Module({
  imports: [TypeOrmModule.forFeature([Genre])],
  controllers: [GenresController],
  providers: [GenresMapperProfile, GenresService],
})
export class GenresModule {
}
