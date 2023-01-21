import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AutomapperModule} from '@automapper/nestjs';
import {classes} from '@automapper/classes';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {AuthorizeModule} from '../authorize/authorize.module';
import {dataSource} from '../database/data-source';
import {MailModule} from '../mail/mail.module';
import {MovieManagementModule} from "../movie-management/movie-management.module";

@Module({
    imports: [
        TypeOrmModule.forRoot(dataSource.options),
        AutomapperModule.forRoot(
            {strategyInitializer: classes()}),
        AuthorizeModule,
        MovieManagementModule,
        MailModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {

}
