import { BadRequestException, Injectable } from '@nestjs/common';
import * as ms from 'ms';
import { JwtService } from '@nestjs/jwt';
import jwtConfigConstants from '../constants/jwt-config.constants';
import { User } from '../../database/entity/user';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OAuth2Client } from 'google-auth-library';
import googleConfigConstants from '../constants/google-config.constants';
import { TokenRepository } from '../../database/repository/token.repository';
import { Token } from '../../database/entity/token';

@Injectable()
export class TokenService {
  private oAuth2Client: OAuth2Client;

  constructor(
    private jwtService: JwtService,
    private tokenRepository: TokenRepository,
  ) {
    this.oAuth2Client = new OAuth2Client(googleConfigConstants.GOOGLE_ID, googleConfigConstants.GOOGLE_SECRET);
  }

  async generateTokensAsync(user: User) {
    try {
      const payload = {
        userId: user.id,
        userProfileId: user?.userProfile?.id,
        roleId: user.role.id,
        role: user.role.name,
        email: user.email,
        name: user.name,
        isActivated: user.isActivated,
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
      const token = new Token();
      token.refreshToken = refreshToken;
      token.expireDate = expireDate;
      token.user = user;
      await this.tokenRepository.create(token);
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
      const refreshToken = await this.tokenRepository
        .getOne()
        .where(x => x.refreshToken)
        .equal(token, { matchCase: true });
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
      const refreshToken = await this.tokenRepository
        .getOne()
        .where(x => x.refreshToken)
        .equal(token, { matchCase: true });
      await this.tokenRepository.delete(refreshToken);
    } catch (err) {
      throw new Error(err);
    }
  }

  async verifyGoogleToken(token: string) {
    try {
      const tokenVerifyResult = await this.oAuth2Client.verifyIdToken({
        idToken: token,
        audience: googleConfigConstants.GOOGLE_ID,
      });

      return tokenVerifyResult?.getPayload();
    } catch (err) {
      throw new BadRequestException('Google authorize token is not valid');
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  private async clearRefreshTokens() {
    const expireTokens = await this.tokenRepository
      .getAll()
      .where(x => x.expireDate)
      .lessThanOrEqual(new Date());
    await this.tokenRepository.delete(expireTokens);
  }
}