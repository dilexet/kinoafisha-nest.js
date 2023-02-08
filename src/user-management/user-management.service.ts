import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { User } from '../database/entity/user';
import { UserViewDto } from './dto/user-view.dto';
import { UserCreateDto } from './dto/user-create.dto';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import appConfigConstants from '../shared/constants/app-config.constants';
import { MailService } from '../mail/mail.service';
import RoleEnum from '../shared/enums/role.enum';
import { UserProfile } from '../database/entity/user-profile';
import { UserRepository } from '../database/repository/user.repository';
import { RoleRepository } from '../database/repository/role.repository';
import { TokenRepository } from '../database/repository/token.repository';

@Injectable()
export class UserManagementService {
  constructor(
    private mailService: MailService,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly tokenRepository: TokenRepository,
  ) {
  }

  async create(userDto: UserCreateDto) {
    const userEmailExist = await this.userRepository
      .getOne()
      .where(x => x.email)
      .equal(userDto.email);

    if (userEmailExist) {
      throw new BadRequestException('User with this email already exist');
    }

    const role = await this.roleRepository.getById(userDto.roleId);
    if (!role) {
      throw new NotFoundException('Role is not exist');
    }

    const passwordHash = await bcrypt.hash(userDto.password, 5);
    const activationLink = uuid.v4();

    const user = this.mapper.map(userDto, UserCreateDto, User);
    user.passwordHash = passwordHash;
    user.activationLink = activationLink;
    user.role = role;
    user.userProfile = new UserProfile();
    const userCreated = await this.userRepository.create(user);

    if (!userCreated) {
      throw new InternalServerErrorException('Error while creating user');
    }

    try {
      await this.mailService.sendUserConfirmationLinkAndLoginAsync(
        userCreated.name,
        userCreated.email,
        userDto.password,
        `${appConfigConstants.API_URL}/authorize/activate/${activationLink}`);
    } catch (err) {
      throw new InternalServerErrorException('Error while sending email');
    }

    return this.mapper.map(userCreated, User, UserViewDto);
  }

  async update(id: string, userDto: UserDto) {
    const userEmailExist = await this.userRepository
      .getOne()
      .where(x => x.email)
      .equal(userDto.email);

    if (userEmailExist && userEmailExist.id != id) {
      throw new BadRequestException('User with this email already exist');
    }

    const user = await this.userRepository.getById(id).include(x => x.role);

    if (!user) {
      throw new NotFoundException('User is not exist');
    }

    const role = await this.roleRepository.getById(userDto.roleId);

    if (!role) {
      throw new NotFoundException('Role is not exist');
    }

    if (user.role.name == RoleEnum.Admin && role.name != RoleEnum.Admin) {
      await this.checkLastAdmin(RoleEnum.Admin);
    }

    user.name = userDto.name;
    user.email = userDto.email;
    user.role = role;

    const userUpdated = await this.userRepository.update(user);
    if (!userUpdated) {
      throw new InternalServerErrorException('Error while updating user');
    }

    return this.mapper.map(userUpdated, User, UserViewDto);
  }

  async remove(id: string): Promise<string> {
    const user = await this.userRepository
      .getById(id)
      .include(x => x.role)
      .include(x => x.userProfile)
      .include(x => x.tokens);
    if (user.role.name === RoleEnum.Admin) {
      await this.checkLastAdmin(RoleEnum.Admin);
    }
    try {
      user.deleted = true;
      user.userProfile.deleted = true;
      if (user.tokens) {
        await this.tokenRepository.delete(user.tokens);
      }
      await this.userRepository.update(user);
      return id;
    } catch (err) {
      console.log(err);
      throw new BadRequestException('User is not exist');
    }
  }

  async changeLockStatus(id: string): Promise<UserViewDto> {
    const user = await this.userRepository
      .getById(id)
      .include(x => x.role);

    if (!user) {
      throw new NotFoundException('User is not exist');
    }

    const newStatus = !user.isBlocked;

    if (user.role.name == RoleEnum.Admin && newStatus) {
      await this.checkLastAdmin(RoleEnum.Admin);
    }

    user.isBlocked = newStatus;
    const userBlocked = await this.userRepository.update(user);
    if (!userBlocked) {
      throw new InternalServerErrorException('Error while change user lock status');
    }

    return this.mapper.map(userBlocked, User, UserViewDto);
  }

  async findAll(name: string): Promise<UserViewDto[]> {
    const usersQuery = this.userRepository
      .getAll()
      .include(x => x.role);
    const users = name
      ? await usersQuery
        .where(x => x.name)
        .contains(name, { matchCase: false })
      : await usersQuery;

    return this.mapper.mapArray(users, User, UserViewDto);
  }

  async findOne(id: string): Promise<UserViewDto> {
    const user = await this.userRepository
      .getById(id)
      .include(x => x.role);

    if (!user) {
      throw new NotFoundException('User is not exist');
    }

    return this.mapper.map(user, User, UserViewDto);
  }

  private async checkLastAdmin(roleName: string) {
    const isLastAdmin = await this.userRepository
      .getAll()
      .include(x => x.role)
      .where(x => x.isBlocked)
      .isFalse()
      .where(x => x.role.name)
      .equal(roleName)
      .count() <= 1;
    if (isLastAdmin) {
      throw new BadRequestException('You cannot remove the last admin');
    }
  }
}
