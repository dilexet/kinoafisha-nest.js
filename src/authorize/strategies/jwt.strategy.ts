import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import jwtConfigConstants from '../constants/jwt-config.constants';
import { UserRepository } from '../../database/repository/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userRepository: UserRepository) {
    super({
      ignoreExpiration: false,
      secretOrKey: jwtConfigConstants.JWT_ACCESS_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: any) {
    const { userId, role } = payload;
    const user = await this.userRepository.getById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return {
      id: userId,
      role: role,
    };
  }
}
