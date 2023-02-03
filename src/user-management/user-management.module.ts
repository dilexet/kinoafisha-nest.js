import { Module } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { UserManagementController } from './user-management.controller';
import { UserManagementMapperProfile } from './mapper/user-management.mapper-profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../database/entity/user';
import { Role } from '../database/entity/role';
import { MailService } from '../mail/mail.service';
import { UserRepository } from '../database/repository/user.repository';
import { RoleRepository } from '../database/repository/role.repository';
import { TokenRepository } from '../database/repository/token.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
  ],
  controllers: [UserManagementController],
  providers: [MailService, UserManagementService, UserManagementMapperProfile, UserRepository, RoleRepository, TokenRepository],
})
export class UserManagementModule {
}
