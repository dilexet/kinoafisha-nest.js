import {
  BadRequestException, ForbiddenException,
  Injectable,
  InternalServerErrorException, NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { User } from '../database/entity/user';
import { RegisterDto } from './dto/register.dto';
import { MailService } from '../mail/mail.service';
import { TokenService } from './utils/token.service';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';
import appConfigConstants from '../shared/constants/app-config.constants';
import { GoogleUserDto } from './dto/google-user.dto';
import { Role } from '../database/entity/role';
import RoleEnum from '../shared/enums/role.enum';
import { AuthProviderEnum } from '../shared/enums/auth-provider.enum';

@Injectable()
export class AuthorizeService {
  constructor(
    private mailService: MailService,
    private tokenService: TokenService,
    @InjectMapper() private readonly mapper: Mapper,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {
  }

  async loginAsync(userDto: LoginDto) {
    const user = await this.userRepository.findOneBy({ email: userDto.email });
    if (!user) {
      throw new BadRequestException('User is not exist');
    }
    const isPasswordsEquals = await bcrypt.compare(userDto.password, user.passwordHash);
    if (!isPasswordsEquals) {
      throw new BadRequestException('Login or password is incorrect');
    }

    if (user.isBlocked) {
      throw new ForbiddenException('Your account has been blocked');
    }

    if (!user.isActivated) {
      throw new ForbiddenException('You need to verify your email');
    }

    try {
      return await this.tokenService.generateTokensAsync(user);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async registrationAsync(userDto: RegisterDto) {
    const candidate = await this.userRepository.findOneBy({ email: userDto.email });
    if (candidate) {
      throw new BadRequestException('User with this email already exist');
    }

    const role = await this.roleRepository.findOneBy({ name: RoleEnum.User });
    if (!role) {
      throw new NotFoundException('Role is not exist');
    }

    try {
      const passwordHash = await bcrypt.hash(userDto.password, 5);
      const activationLink = uuid.v4();

      const newUser = this.mapper.map(userDto, RegisterDto, User);
      newUser.passwordHash = passwordHash;
      newUser.activationLink = activationLink;
      newUser.role = role;

      const user = await this.userRepository.save(newUser);

      const tokens = await this.tokenService.generateTokensAsync(user);

      await this.mailService.sendUserConfirmationLinkAsync(
        userDto.name,
        userDto.email,
        `${appConfigConstants.API_URL}/authorize/activate/${activationLink}`);

      return tokens;
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async logoutAsync(refreshToken: string) {
    try {
      await this.tokenService.removeTokenAsync(refreshToken);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async refreshAsync(tokenDto: TokenDto) {
    if (!tokenDto) {
      throw new UnauthorizedException();
    }

    const userId = await this.tokenService.validateRefreshTokenAsync(tokenDto.refreshToken);
    if (!userId) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.isBlocked) {
      throw new ForbiddenException('Your account has been blocked');
    }

    if (!user.isActivated) {
      throw new ForbiddenException('You need to verify your email');
    }

    const tokens = await this.tokenService.generateTokensAsync(user);

    if (!tokens) {
      throw new UnauthorizedException();
    }

    await this.tokenService.removeTokenAsync(tokenDto.refreshToken);
    return tokens;
  }

  async activateAsync(activationLink: string) {
    const user = await this.userRepository.findOneBy({ activationLink: activationLink });
    if (!user) {
      throw new BadRequestException('Incorrect activation link');
    }

    user.isActivated = true;
    try {
      await this.userRepository.save(user);
    } catch (err) {
      throw new InternalServerErrorException('Activation error');
    }
  }

  async googleSignIn(userDto: GoogleUserDto) {
    const candidate = await this.userRepository.findOneBy({ email: userDto.email });

    if (!candidate) {
      return await this.registerGoogleUser(userDto);
    }

    if (candidate.provider == AuthProviderEnum.LOCAL) {
      throw new BadRequestException('You need to authorize with login and password');
    }

    if (candidate.isBlocked) {
      throw new ForbiddenException('Your account has been blocked');
    }

    return await this.tokenService.generateTokensAsync(candidate);
  }

  private async registerGoogleUser(userDto: GoogleUserDto) {
    const role = await this.roleRepository.findOneBy({ name: RoleEnum.User });
    if (!role) {
      throw new InternalServerErrorException('You did not create roles');
    }

    try {
      const newUser = this.mapper.map(userDto, GoogleUserDto, User);
      newUser.isActivated = true;
      newUser.role = role;
      newUser.provider = AuthProviderEnum.GOOGLE;

      const user = await this.userRepository.save(newUser);

      return await this.tokenService.generateTokensAsync(user);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}