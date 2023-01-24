import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entity/user';
import { Role } from '../database/entity/role';
import { UserViewDto } from './dto/user-view.dto';
import { UserCreateDto } from './dto/user-create.dto';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import appConfigConstants from '../shared/constants/app-config.constants';
import { MailService } from '../mail/mail.service';
import RoleEnum from '../shared/enums/role.enum';
import { UserLockStatus } from '../shared/enums/user-lock-status.enum';

@Injectable()
export class UserManagementService {
  constructor(
    private mailService: MailService,
    @InjectMapper() private readonly mapper: Mapper,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {
  }

  async create(userDto: UserCreateDto) {
    const userEmailExist = await this.userRepository.findOne(
      {
        where: { email: userDto.email },
        relations: { role: false },
      },
    );
    if (userEmailExist) {
      throw new BadRequestException('User with this email already exist');
    }

    const role = await this.roleRepository.findOneBy({ id: userDto.roleId });
    if (!role) {
      throw new NotFoundException('Role is not exist');
    }

    const passwordHash = await bcrypt.hash(userDto.password, 5);
    const activationLink = uuid.v4();

    const user = this.mapper.map(userDto, UserCreateDto, User);
    user.passwordHash = passwordHash;
    user.activationLink = activationLink;
    user.role = role;

    const userCreated = await this.userRepository.save(user);

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
    const userEmailExist = await this.userRepository.findOne(
      {
        where: { email: userDto.email },
        relations: { role: false },
      },
    );

    if (userEmailExist && userEmailExist.id != id) {
      throw new BadRequestException('User with this email already exist');
    }

    const user = await this.userRepository.findOne(
      {
        where: { id: id },
        relations: { role: true },
      },
    );

    if (!user) {
      throw new NotFoundException('User is not exist');
    }

    const role = await this.roleRepository.findOne(
      {
        where: { id: userDto.roleId },
        relations: { users: false },
      },
    );
    if (!role) {
      throw new NotFoundException('Role is not exist');
    }

    // TODO: CHECK IT !!!
    if (user.role.name == RoleEnum.Admin && role.name != RoleEnum.Admin) {
      await this.checkLastAdmin(RoleEnum.Admin);
    }

    user.name = userDto.name;
    user.email = userDto.email;
    user.role = role;

    const userUpdated = await this.userRepository.save(user);
    if (!userUpdated) {
      throw new InternalServerErrorException('Error while updating user');
    }

    return this.mapper.map(userUpdated, User, UserViewDto);
  }

  async remove(id: string): Promise<string> {
    await this.checkLastAdmin(RoleEnum.Admin);
    try {
      await this.userRepository.delete(id);
      return id;
    } catch (err) {
      throw new BadRequestException('User is not exist');
    }
  }

  async changeLockStatus(id: string, lockStatus: UserLockStatus): Promise<UserViewDto> {
    const user = await this.userRepository.findOne(
      {
        where: { id: id },
        relations: { role: true },
      },
    );
    if (!user) {
      throw new NotFoundException('User is not exist');
    }

    const shouldBlock = lockStatus == UserLockStatus.BLOCK;

    if (user.isBlocked == shouldBlock) {
      throw new BadRequestException(
        `User already ${shouldBlock ? 'blocked' : 'unlocked'}`);
    }

    if (user.role.name == RoleEnum.Admin && shouldBlock) {
      await this.checkLastAdmin(RoleEnum.Admin);
    }

    user.isBlocked = shouldBlock;
    const userBlocked = await this.userRepository.save(user);
    if (!userBlocked) {
      throw new InternalServerErrorException('Error while change user lock status');
    }

    return this.mapper.map(userBlocked, User, UserViewDto);
  }

  async findAll(): Promise<UserViewDto[]> {
    const users = await this.userRepository.find(
      { relations: { role: true } },
    );

    return this.mapper.mapArray(users, User, UserViewDto);
  }

  async findOne(id: string): Promise<UserViewDto> {
    const user = await this.userRepository.findOne(
      {
        where: { id: id },
        relations: { role: true },
      },
    );

    if (!user) {
      throw new NotFoundException('User is not exist');
    }

    return this.mapper.map(user, User, UserViewDto);
  }

  private async checkLastAdmin(roleName: string) {
    const isLastAdmin = await this.userRepository.count(
      { where: { role: { name: roleName }, isBlocked: false }, relations: { role: true } }) <= 1;
    if (isLastAdmin) {
      throw new BadRequestException('You cannot remove the last admin');
    }
  }
}
