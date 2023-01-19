import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import config from '../config/authorize.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class TokenService {
    constructor(
        private jwtService: JwtService,
        @Inject(config.KEY) private configService: ConfigType<typeof config>,
    ) {
    }

    generateTokens(payload) {
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.jwt.accessSecret,
            expiresIn: this.configService.jwt.accessExpiresIn,
        });

        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.jwt.refreshSecret,
            expiresIn: this.configService.jwt.refreshExpiresIn,
        });

        return {
            accessToken, refreshToken,
        };
    }

    // async saveToken(userId, refreshToken) {
    //     const user = await this.userRepository.findOneBy({ id: userId });
    //     if (!user) {
    //         throw new Error('User is not exist');
    //     }
    //     const token = await this.tokenRepository.create({
    //         refreshToken: refreshToken,
    //         user: user,
    //     });
    //
    //     await this.tokenRepository.save(token);
    //
    //     return token;
    // }
}