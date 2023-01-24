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

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSource.options),
    AutomapperModule.forRoot(
      { strategyInitializer: classes() }),
    ScheduleModule.forRoot(),
    MailModule,
    AuthorizeModule,
    MovieManagementModule,
    CinemaManagementModule,
    HallManagementModule,
    UserManagementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

}
