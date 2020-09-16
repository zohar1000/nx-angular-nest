import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy }     from '@nestjs/passport';
import { Injectable }           from '@nestjs/common';
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
    let user: AuthUser;
    try {
      const userDoc: UserDoc = await this.userService.findById(payload.sub.userId);
      if (userDoc && userDoc.status === UserStatus.Active) {
        user = { id: userDoc._id, role: userDoc.role, status: userDoc.status };
      }
    } catch(e) {
      // user = {};
    }
    return user;
  }
}
