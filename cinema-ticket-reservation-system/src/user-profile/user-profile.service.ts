import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { UserProfileRepository } from '../database/repository/user-profile.repository';
import { UserProfileViewDto } from './dto/user-profile-view.dto';
import { UserProfile } from '../database/entity/user-profile';
import { UserProfileUpdateViewDto } from './dto/user-profile-update-view.dto';
import { AuthProviderEnum } from '../shared/enums/auth-provider.enum';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import appConfigConstants from '../shared/constants/app-config.constants';
import { MailService } from '../mail/mail.service';
import { UserRepository } from '../database/repository/user.repository';
import { User } from '../database/entity/user';

@Injectable()
export class UserProfileService {
  constructor(
    @InjectMapper() private readonly mapper: Mapper,
    private mailService: MailService,
    private readonly userProfileRepository: UserProfileRepository,
    private readonly userRepository: UserRepository,
  ) {
  }

  async updateAsync(id: string, userProfileDto: UpdateUserProfileDto): Promise<UserProfileUpdateViewDto> {
    const userProfile = await this.userProfileRepository
      .getById(id)
      .include(x => x.user);

    if (!userProfile) {
      throw new BadRequestException('User is not found');
    }

    if (userProfile.user.provider !== AuthProviderEnum.LOCAL && (userProfileDto?.email || userProfileDto?.newPassword)) {
      throw new BadRequestException('You cannot change your email and/or password because you were authorized through other services');
    }

    if (userProfileDto?.name && userProfileDto?.name !== userProfile.user.name) {
      userProfile.user.name = userProfileDto.name;
    }

    if (userProfileDto?.email && userProfileDto?.email !== userProfile.user.email) {
      userProfile.user.email = userProfileDto.email;
      userProfile.user.isActivated = false;
      const activationLink = uuid.v4();
      userProfile.user.activationLink = activationLink;

      try {
        await this.mailService.sendUserConfirmationLinkAsync(
          userProfile.user.name,
          userProfile.user.email,
          `${appConfigConstants.API_URL}/authorize/activate/${activationLink}`);
      } catch (err) {
        throw new InternalServerErrorException('Error while sending email');
      }
    }

    if (userProfileDto?.newPassword && userProfileDto?.oldPassword) {
      const isPasswordsEquals = await bcrypt.compare(userProfileDto.oldPassword, userProfile.user.passwordHash);
      if (!isPasswordsEquals) {
        throw new BadRequestException('Old password does not match current password');
      }

      if (userProfileDto?.newPassword === userProfileDto?.oldPassword) {
        throw new BadRequestException('New password cannot match old password');
      }

      userProfile.user.passwordHash = await bcrypt.hash(userProfileDto.newPassword, 5);
    }

    const userUpdated = await this.userRepository.update(userProfile.user);

    return this.mapper.map(userUpdated, User, UserProfileUpdateViewDto);
  }

  async findOneAsync(id: string): Promise<UserProfileViewDto> {
    const userProfile = await this.userProfileRepository
      .getById(id)
      .include(x => x.user)
      .include(x => x.bookedOrders)
      .thenInclude(x => x.sessionSeats)
      .thenInclude(x => x.session)
      .include(x => x.bookedOrders)
      .thenInclude(x => x.sessionSeats)
      .thenInclude(x => x.seat)
      .thenInclude(x => x.seatType)
      .include(x => x.bookedOrders)
      .thenInclude(x => x.sessionSeats)
      .thenInclude(x => x.seat)
      .thenInclude(x => x.row);

    if (!userProfile) {
      throw new NotFoundException('User is not exist');
    }

    return this.mapper.map(userProfile, UserProfile, UserProfileViewDto);
  }
}
