import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorizeModule } from './authorize/authorize.module';
import { AppDataSource } from './data-source';
import { MailModule } from './mail/mail.module';


@Module({
    imports: [
        TypeOrmModule.forRoot(AppDataSource.options),
        ConfigModule.forRoot({ isGlobal: true }),
        AutomapperModule.forRoot(
            { strategyInitializer: classes() }),
        AuthorizeModule, MailModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {

}
