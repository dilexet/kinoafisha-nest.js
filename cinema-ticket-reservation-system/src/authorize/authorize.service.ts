import {
    BadRequestException, Inject,
    Injectable, InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { User } from '../entity/User';
import { RegisterDto } from './dto/register.dto';
import { MailService } from '../mail/mail.service';
import { TokenService } from './utils/token.service';
import { Token } from '../entity/Token';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import config from './config/authorize.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class AuthorizeService {
    constructor(
        private mailService: MailService,
        private tokenService: TokenService,
        @Inject(config.KEY) private configService: ConfigType<typeof config>,
        @InjectMapper() private readonly mapper: Mapper,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Token) private tokenRepository: Repository<Token>,
    ) {
    }

    async registration(userDto: RegisterDto) {
        const candidate = await this.userRepository.findOne({ where: { email: userDto.email } });
        if (candidate) {
            throw new BadRequestException('User with this email already exist');
        }
        try {
            const passwordHash = await bcrypt.hash(userDto.password, 5);
            const activationLink = uuid.v4();

            const newUser = this.mapper.map(userDto, RegisterDto, User);
            newUser.passwordHash = passwordHash;
            newUser.activationLink = activationLink;

            const user = await this.userRepository.save(newUser);

            const tokens = this.tokenService.generateTokens(
                {
                    userId: user.id,
                    email: user.email,
                    idActivated: user.isActivated,
                },
            );

            await this.tokenRepository.save({
                refreshToken: tokens.refreshToken,
                user: user,
            });

            await this.mailService.sendUserConfirmation(
                userDto,
                `${this.configService.apiUrl}/activate/${activationLink}`);

            return {
                ...tokens,
            };
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    async activate(activationLink: string) {
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

    // async signIn(user) {
    //     if (!user) {
    //         throw new BadRequestException('Unauthenticated');
    //     }
    //
    //     const userExists = await this.findUserByEmail(user.email);
    //
    //     if (!userExists) {
    //         return this.registerUser(user);
    //     }
    //
    //     return this.generateJwt({
    //         sub: userExists.id,
    //         email: userExists.email,
    //     });
    // }
    //
    // // TODO: maping
    // async registerUser(user: RegisterDto) {
    //     try {
    //         const newUser = this.userRepository.create(user);
    //
    //         await this.userRepository.save(newUser);
    //
    //         return this.generateJwt({
    //             sub: newUser.id,
    //             email: newUser.email,
    //         });
    //     } catch {
    //         throw new InternalServerErrorException();
    //     }
    // }
    //
    // async findUserByEmail(email: string) {
    //     const user = await this.userRepository.findOne({ where: { email } });
    //
    //     if (!user) {
    //         return null;
    //     }
    //
    //     return user;
    // }
}