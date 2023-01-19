import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizeController } from './authorize.controller';
import { AuthorizeService } from './authorize.service';
import { User } from '../entity/User';
import { TokenService } from './utils/token.service';
import { Role } from '../entity/Role';
import { Token } from '../entity/Token';
import { AuthorizeMapperProfile } from './mapper/authorize.mapper-profile';
import { MailService } from '../mail/mail.service';
import jwtConfigConstants from './constants/jwt-config.constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Token, Role]),
    JwtModule.register({
      secret: jwtConfigConstants.JWT_ACCESS_SECRET,
      signOptions: {
        expiresIn: jwtConfigConstants.JWT_ACCESS_EXPIRES_IN,
      },
    }),
  ],
  controllers: [AuthorizeController],
  providers: [
    AuthorizeMapperProfile,
    JwtStrategy,
    GoogleStrategy,
    MailService,
    JwtService,
    TokenService,
    AuthorizeService],
})
export class AuthorizeModule {
}
