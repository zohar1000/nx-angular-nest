import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from '../../shared/shared.module';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { appConfig } from '../../app-config';

@Module({
  imports: [
    SharedModule,
    PassportModule,
    JwtModule.register({
      secret: appConfig.auth.jwt.accessTokenSecretKey,
      signOptions: { expiresIn: appConfig.auth.jwt.accessTokenExpiresIn },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy]
})
export class AuthModule {}
