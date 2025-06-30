import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { appConfig } from '../../../config/app.config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: appConfig.google.clientId,
      clientSecret: appConfig.google.clientSecret,
      callbackURL: appConfig.google.callbackUrl,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      fullName: name.givenName + ' ' + name.familyName,
      username: emails[0].value.split('@')[0],
      profileImage: photos[0].value,
    };

    const result = await this.authService.validateOrCreateGoogleUser(user);
    done(null, result);
  }
}