import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GITHUB_CLIENT_ID || 'placeholder',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || 'placeholder',
      callbackURL:
        process.env.GITHUB_CALLBACK_URL ||
        'http://localhost:3000/api/v1/auth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const { username, emails, photos, id, displayName } = profile;
    const user = {
      email:
        emails && emails.length > 0
          ? emails[0].value
          : `${username}@github.local`,
      firstName: displayName || username,
      lastName: '',
      picture: photos && photos.length > 0 ? photos[0].value : '',
      accessToken,
      provider: 'github',
      providerId: id,
    };

    const result = await this.authService.validateOAuthUser(user);
    done(null, result);
  }
}
