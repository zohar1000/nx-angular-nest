import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy }     from '@nestjs/passport';
import { Injectable }           from '@nestjs/common';
import { UserStatus } from '../enums/user-status.enum';
import { UserService } from '../../../shared/services/entities/user.service';
import { UserDoc } from '../../../shared/models/db/user-doc.model';
import { ConfigService } from '../../../shared/services/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService,
              private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getAuthJwt().accessTokenSecretKey
    });
  }

  async validate(payload: any) {
    let user;
    try {
      const userDoc: UserDoc = await this.userService.findById(payload.sub.userId);
      if (userDoc && userDoc.status === UserStatus.Active) {
        user = { userId: payload.sub.userId, role: userDoc.role, status: userDoc.status };
      }
    } catch(e) {
      // user = {};
    }
    return user;
  }
}
