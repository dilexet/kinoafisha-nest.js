import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { User } from '../entity/User';
import { RegisterDto } from './dto/register.dto';
import { MailService } from '../mail/mail.service';
import { TokenService } from './utils/token.service';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { LoginDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';
import appConfigConstants from '../constants/app-config.constants';
import { GoogleUserDto } from './dto/google-user.dto';

@Injectable()
export class AuthorizeService {
  constructor(
    private mailService: MailService,
    private tokenService: TokenService,
    @InjectMapper() private readonly mapper: Mapper,
    @InjectRepository(User) private userRepository: Repository<User>,
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
    const candidate = await this.userRepository.findOneBy({ email: userDto.email });
    if (candidate) {
      throw new BadRequestException('User with this email already exist');
    }
    await this.userRepository.queryRunner.startTransaction();
    try {
      const passwordHash = await bcrypt.hash(userDto.password, 5);
      const activationLink = uuid.v4();

      const newUser = this.mapper.map(userDto, RegisterDto, User);
      newUser.passwordHash = passwordHash;
      newUser.activationLink = activationLink;

      const user = await this.userRepository.save(newUser);

      const tokens = await this.tokenService.generateTokensAsync(user);

      await this.mailService.sendUserConfirmationAsync(
        userDto,
        `${appConfigConstants.API_URL}/authorize/activate/${activationLink}`);
      await this.userRepository.queryRunner.commitTransaction();

      return tokens;
    } catch (err) {
      await this.userRepository.queryRunner.rollbackTransaction();

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

    return await this.tokenService.generateTokensAsync(candidate);
  }

  private async registerGoogleUser(userDto: GoogleUserDto) {
    await this.userRepository.queryRunner.startTransaction();
    try {
      const newUser = this.mapper.map(userDto, GoogleUserDto, User);

      const user = await this.userRepository.save(newUser);

      const tokens = await this.tokenService.generateTokensAsync(user);

      await this.userRepository.queryRunner.commitTransaction();

      return tokens;
    } catch (err) {
      await this.userRepository.queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err);
    }
  }
}