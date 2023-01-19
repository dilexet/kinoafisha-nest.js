import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from '../../entity/Token';
import { Repository } from 'typeorm';
import jwtConfigConstants from '../constants/jwt-config.constants';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
  ) {
  }

  async generateTokensAsync(user) {
    try {
      const payload = {
        userId: user.id,
        email: user.email,
        idActivated: user.isActivated,
      };
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: jwtConfigConstants.JWT_ACCESS_SECRET,
        expiresIn: jwtConfigConstants.JWT_ACCESS_EXPIRES_IN,
      });

      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: jwtConfigConstants.JWT_REFRESH_SECRET,
        expiresIn: jwtConfigConstants.JWT_REFRESH_EXPIRES_IN,
      });

      await this.tokenRepository.save({
        refreshToken: refreshToken,
        user: user,
      });

      return {
        accessToken, refreshToken,
      };
    } catch (err) {
      throw new Error(err);
    }
  }

  async validateRefreshTokenAsync(token: string) {
    try {
      const refreshTokenData =
        await this.jwtService.verifyAsync(
          token,
          { secret: jwtConfigConstants.JWT_REFRESH_SECRET });
      if (!refreshTokenData) {
        return null;
      }
      const refreshToken = await this.tokenRepository.findOneBy(
        { refreshToken: token });
      if (!refreshToken) {
        return null;
      }

      return refreshTokenData.userId;
    } catch (err) {
      return null;
    }
  }

  async validateAccessTokenAsync(token: string) {
    try {
      const accessTokenData =
        await this.jwtService.verifyAsync(
          token,
          { secret: jwtConfigConstants.JWT_ACCESS_SECRET });
      if (!accessTokenData) {
        return null;
      }
      return accessTokenData;
    } catch (err) {
      return null;
    }
  }

  async removeTokenAsync(token) {
    try {
      await this.tokenRepository.delete({ refreshToken: token });
    } catch (err) {
      throw new Error(err);
    }
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