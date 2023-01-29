import { Injectable } from '@nestjs/common';
import * as ms from 'ms';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Token } from '../../database/entity/token';
import { Repository, LessThanOrEqual } from 'typeorm';
import jwtConfigConstants from '../constants/jwt-config.constants';
import { User } from '../../database/entity/user';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
  ) {
  }

  async generateTokensAsync(user: User) {
    try {
      const payload = {
        userId: user.id,
        roleId: user.role.id,
        role: user.role.name,
        email: user.email,
        idActivated: user.isActivated,
      };
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: jwtConfigConstants.JWT_ACCESS_SECRET,
        expiresIn: jwtConfigConstants.JWT_ACCESS_EXPIRES_IN,
      });

      const expiresInMilliseconds = ms(jwtConfigConstants.JWT_REFRESH_EXPIRES_IN);
      const expireDate = new Date();
      expireDate.setMilliseconds(expiresInMilliseconds);

      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: jwtConfigConstants.JWT_REFRESH_SECRET,
        expiresIn: jwtConfigConstants.JWT_REFRESH_EXPIRES_IN,
      });

      await this.tokenRepository.save({
        refreshToken: refreshToken,
        expireDate: expireDate,
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

  async removeTokenAsync(token: string) {
    try {
      await this.tokenRepository.delete({ refreshToken: token });
    } catch (err) {
      throw new Error(err);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  private async clearRefreshTokens() {
    const expireTokens = await this.tokenRepository.find(
      {
        where: { expireDate: LessThanOrEqual(new Date()) },
        relations: { user: false },
      },
    );
    for (const expireToken of expireTokens) {
      await this.tokenRepository.delete(expireToken.id);
      console.log(expireToken.id);
    }
  }
}