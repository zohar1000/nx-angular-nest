import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserStatus } from '../enums/user-status.enum';
import { UserService } from '../../../shared/services/entities/user.service';
import { UserDoc } from '@shared/models/user-doc.model';
import { appConfig } from '../../../app-config';
import { AuthUser } from '../../../shared/models/auth-user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig.auth.jwt.accessTokenSecretKey
    });
  }

  async validate(payload: any) {
    let user;
    try {
      const userDoc = await this.userService.findById(payload.sub.userId) as UserDoc;
      if (userDoc && userDoc.status === UserStatus.Active) {
        user = { id: userDoc._id as number, role: userDoc.role, status: userDoc.status };
      }
    } catch(e) {
      // user = {};
    }
    return user;
  }
}
