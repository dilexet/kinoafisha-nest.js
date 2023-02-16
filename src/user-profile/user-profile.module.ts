import { Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { UserProfileMapperProfile } from './mapper/user-profile.mapper-profile';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookedOrder } from '../database/entity/booked-order';
import { UserProfile } from '../database/entity/user-profile';
import { User } from '../database/entity/user';
import { UserProfileRepository } from '../database/repository/user-profile.repository';
import { MailService } from '../mail/mail.service';
import { UserRepository } from '../database/repository/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BookedOrder, UserProfile, User])],
  controllers: [UserProfileController],
  providers: [
    UserProfileMapperProfile,
    MailService,
    UserProfileService,
    UserProfileRepository,
    UserRepository,
  ],
})
export class UserProfileModule {}
