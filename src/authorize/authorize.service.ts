import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
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
import RoleEnum from '../shared/enums/role.enum';
import { AuthProviderEnum } from '../shared/enums/auth-provider.enum';
import { UserProfile } from '../database/entity/user-profile';
import { UserRepository } from '../database/repository/user.repository';
import { RoleRepository } from '../database/repository/role.repository';

@Injectable()
export class AuthorizeService {
  constructor(
    private mailService: MailService,
    private tokenService: TokenService,
    @InjectMapper() private readonly mapper: Mapper,
    private userRepository: UserRepository,
    private roleRepository: RoleRepository,
  ) {}

  async loginAsync(userDto: LoginDto) {
    const user = await this.userRepository
      .getOne()
      .include((x) => x.userProfile)
      .include((x) => x.role)
      .where((x) => x.email)
      .equal(userDto.email);
    if (!user) {
      throw new BadRequestException('User is not exist');
    }
    const isPasswordsEquals = await bcrypt.compare(
      userDto.password,
      user.passwordHash,
    );
    if (!isPasswordsEquals) {
      throw new BadRequestException('Login or password is incorrect');
    }

    if (user.isBlocked) {
      throw new BadRequestException('Your account has been blocked');
    }

    if (!user.isActivated) {
      throw new BadRequestException('You need to verify your email');
    }

    try {
      return await this.tokenService.generateTokensAsync(user);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }

  async registrationAsync(userDto: RegisterDto) {
    const candidate = await this.userRepository
      .getOne()
      .where((x) => x.email)
      .equal(userDto.email);
    if (candidate) {
      throw new BadRequestException('User with this email already exist');
    }

    const role = await this.roleRepository
      .getOne()
      .where((x) => x.name)
      .equal(RoleEnum.User);
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
      newUser.userProfile = new UserProfile();

      const user = await this.userRepository.create(newUser);

      const tokens = await this.tokenService.generateTokensAsync(user);

      await this.mailService.sendUserConfirmationLinkAsync(
        userDto.name,
        userDto.email,
        `${appConfigConstants.API_URL}/authorize/activate/${activationLink}`,
      );

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

    const userId = await this.tokenService.validateRefreshTokenAsync(
      tokenDto.refreshToken,
    );
    if (!userId) {
      throw new UnauthorizedException();
    }

    const user = await this.userRepository
      .getById(userId)
      .include((x) => x.userProfile)
      .include((x) => x.role);
    if (!user) {
      throw new UnauthorizedException();
    }

    if (user.isBlocked) {
      throw new UnauthorizedException('Your account has been blocked');
    }

    if (!user.isActivated) {
      throw new UnauthorizedException('You need to verify your email');
    }

    const tokens = await this.tokenService.generateTokensAsync(user);

    if (!tokens) {
      throw new UnauthorizedException();
    }

    await this.tokenService.removeTokenAsync(tokenDto.refreshToken);
    return tokens;
  }

  async activateAsync(activationLink: string) {
    const user = await this.userRepository
      .getOne()
      .where((x) => x.activationLink)
      .equal(activationLink);
    if (!user) {
      throw new BadRequestException('Incorrect activation link');
    }

    user.isActivated = true;
    try {
      await this.userRepository.update(user);
    } catch (err) {
      throw new InternalServerErrorException('Activation error');
    }
  }

  async googleSignIn(token: string) {
    const tokenPayload = await this.tokenService.verifyGoogleToken(token);
    const { name, email } = tokenPayload;

    const candidate = await this.userRepository
      .getOne()
      .include((x) => x.userProfile)
      .include((x) => x.role)
      .where((x) => x.email)
      .equal(email);

    if (!candidate) {
      return await this.registerGoogleUser(name, email);
    }

    if (candidate.provider === AuthProviderEnum.LOCAL) {
      throw new BadRequestException(
        'You need to authorize with login and password',
      );
    }

    if (candidate.isBlocked) {
      throw new BadRequestException('Your account has been blocked');
    }

    return await this.tokenService.generateTokensAsync(candidate);
  }

  private async registerGoogleUser(name: string, email: string) {
    const role = await this.roleRepository
      .getOne()
      .where((x) => x.name)
      .equal(RoleEnum.User);
    if (!role) {
      throw new InternalServerErrorException('You did not create roles');
    }

    const newUser = new User();
    newUser.name = name;
    newUser.email = email;
    newUser.isActivated = true;
    newUser.role = role;
    newUser.provider = AuthProviderEnum.GOOGLE;
    newUser.userProfile = new UserProfile();

    const userCreated = await this.userRepository.create(newUser);

    if (!userCreated) {
      throw new BadRequestException('Error while creating google user');
    }

    return await this.tokenService.generateTokensAsync(userCreated);
  }
}
