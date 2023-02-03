import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizeController } from './authorize.controller';
import { AuthorizeService } from './authorize.service';
import { User } from '../database/entity/user';
import { TokenService } from './utils/token.service';
import { Role } from '../database/entity/role';
import { Token } from '../database/entity/token';
import { AuthorizeMapperProfile } from './mapper/authorize.mapper-profile';
import { MailService } from '../mail/mail.service';
import jwtConfigConstants from './constants/jwt-config.constants';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RoleGuard } from './guards/role.guard';
import { UserRepository } from '../database/repository/user.repository';
import { RoleRepository } from '../database/repository/role.repository';

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
    JwtAuthGuard,
    RoleGuard,
    MailService,
    JwtService,
    TokenService,
    AuthorizeService,
    UserRepository,
    RoleRepository,
  ],
})
export class AuthorizeModule {
}
