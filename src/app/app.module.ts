import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorizeModule } from '../authorize/authorize.module';
import { dataSource } from '../database/data-source';
import { MailModule } from '../mail/mail.module';
import { MovieManagementModule } from '../movie-management/movie-management.module';
import { CinemaManagementModule } from '../cinema-management/cinema-management.module';
import { HallManagementModule } from '../hall-management/hall-management.module';
import { UserManagementModule } from '../user-management/user-management.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SessionManagementModule } from '../session-management/session-management.module';
import { ImageUploadModule } from '../image-upload/image-upload.module';
import { GenresModule } from '../genres/genres.module';
import { CountriesModule } from '../countries/countries.module';
import { RolesModule } from '../roles/roles.module';
import { SeatTypesModule } from '../seat-types/seat-types.module';
import { CinemasModule } from '../cinemas/cinemas.module';
import { HallsModule } from '../halls/halls.module';
import { MoviesModule } from '../movies/movies.module';
import { MovieFilterModule } from '../movie-filter/movie-filter.module';
import { BookingModule } from '../booking/booking.module';
import { UserProfileModule } from '../user-profile/user-profile.module';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSource.options),
    AutomapperModule.forRoot({ strategyInitializer: classes() }),
    ScheduleModule.forRoot(),
    MailModule,
    CommentsModule,
    ImageUploadModule,
    GenresModule,
    CountriesModule,
    RolesModule,
    SeatTypesModule,
    CinemasModule,
    HallsModule,
    MoviesModule,
    AuthorizeModule,
    UserManagementModule,
    CinemaManagementModule,
    HallManagementModule,
    MovieManagementModule,
    SessionManagementModule,
    MovieFilterModule,
    BookingModule,
    UserProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
