import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import config from './config/authorize.config';
import { AuthorizeController } from './authorize.controller';
import { AuthorizeService } from './authorize.service';
import { User } from '../entity/User';
import { TokenService } from './utils/token.service';
import { Role } from '../entity/Role';
import { Token } from '../entity/Token';
import { AuthorizeMapperProfile } from './mapper/authorize.mapper-profile';
import { MailService } from '../mail/mail.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Token, Role]), ConfigModule.forFeature(config)],
    exports: [TypeOrmModule],
    controllers: [AuthorizeController],
    providers: [
        AuthorizeMapperProfile,
        MailService,
        JwtService,
        TokenService,
        AuthorizeService],
})
export class AuthorizeModule {
}
