import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entity/User';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import googleConfigConstants from '../constants/google-config.constants';
import { GoogleUserDto } from '../dto/google-user.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super({
      clientID: googleConfigConstants.GOOGLE_ID,
      clientSecret: googleConfigConstants.GOOGLE_CLIENT_SECRET,
      callbackURL: googleConfigConstants.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { displayName, emails } = profile;

    const user: GoogleUserDto = {
      email: emails[0].value,
      name: displayName,
    };

    done(null, user);
  }
}