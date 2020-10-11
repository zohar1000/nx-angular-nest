import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { BaseService } from '../../../shared/base-classes/base.service';
import { EncryptionService } from '../../../shared/services/encryption.service';
import { UserService } from '../../../shared/services/entities/user.service';
import { LoginDto } from '../dtos/login.dto';
import { UserDoc } from '@shared/models/user-doc.model';
import { ZObj } from 'zshared';
import { UserStatus } from '../enums/user-status.enum';
import { appConfig } from '../../../app-config';
import { AuthUser } from '../../../shared/models/auth-user.model';
import { LocalStrategyResponse } from '@shared/models/local-strategy-response.model';
import { UserProfile } from '@shared/models/user-profile.model';
import { RefreshTokenResponse } from '@shared/models/refresh-token-response.model';
import { ServerLoginResponse } from '@shared/models/server-login-response.model';
import { appText$ } from '@sample-app/shared/consts/app-text.const';

@Injectable()
export class AuthService extends BaseService {
  constructor(private readonly userService: UserService,
              private readonly jwtService: JwtService,
              private readonly encryptionService: EncryptionService) {
    super();
  }

  /*************************************/
  /*   L O G I N  /  S I G N   U P     */
  /*************************************/

  async permissions(user: AuthUser) {
    return new Promise(async (resolve, reject) => {
      try {
        const userDoc = user ? await this.userService.findById(user.id) : null;
        if (!userDoc) {
          this.logi('permission request was made for a user which does not exist', user);
          reject(new Error('user does not exist'));
        } else {
          resolve(this.getAuthProfile(userDoc));
        }
      } catch (e) {
        this.loge('permissions failed', user, e);
        reject(e);
      }
    });
  }

  async login(dto: LoginDto, resp: LocalStrategyResponse) {
    return new Promise<ServerLoginResponse>(async (resolve, reject) => {
      try {
        if (!resp.isLoginSuccess) {
          resolve( { isSuccess: false, message: appText$.value.errors.loginFailed });
        } else {
          const userDoc = resp.userDoc as UserDoc;
          await this.userService.updateById(userDoc._id, { lastLoginTime: Date.now()});
          const profile: UserProfile = this.getAuthProfile(userDoc);
          const accessToken = await this.getAccessToken({ userId: userDoc._id });
          const refreshToken = await this.getRefreshToken({ userId: userDoc._id });
          resp.user = profile;
          delete resp.userDoc;
          resolve({ isSuccess: true, user: resp.user, accessToken, refreshToken });
        }
      } catch (e) {
        this.loge('login failed', dto, e);
        reject(e);
      }
    });
  }

  async refresh(refreshToken) {
    return new Promise<RefreshTokenResponse>(async (resolve, reject) => {
      try {
        const token = refreshToken ? await this.verifyRefreshToken(refreshToken) as any : null;
        if (token) {
          const accessToken = await this.getAccessToken({ userId: token.userId });
          refreshToken = await this.getRefreshToken({ userId: token.userId });
          resolve({ isSuccess: true, accessToken, refreshToken });
        } else {
          reject(new Error('user is not authorized'));
        }
      } catch (e) {
        this.loge('refresh failed', refreshToken, e);
        reject(e);
      }
    });
  }

  async forgotPassword(email) {
    return new Promise(async (resolve, reject) => {
      try {
        email = email.trim();
        const userDoc: UserDoc = await this.userService.findByEmail(email);
        if (!userDoc) this.logiAndThrow('invalid email');
        const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const CHARS_LEN = CHARS.length;
        const PASSWORD_LENGTH = 8;
        let verbalPassword = '';
        for (let i = 0; i < PASSWORD_LENGTH; i++) {
          verbalPassword += CHARS.charAt(Math.random() * CHARS_LEN);
        }
        console.log(`password has been changed for user ${userDoc._id}/${email}, the new password is: ${verbalPassword}`);
        const password = this.encryptionService.getHashedPassword(verbalPassword);
        await this.userService.updateById(userDoc._id, {password});
        const subject = appConfig.brandName + ' support - reset password';
        const body = 'Your password has been reset.<br/><br/>Your new password is: ' + verbalPassword;
        // await this.mailService.send(email, subject, body);
        resolve();
      } catch (e) {
        this.loge('error in forgot password', email, e);
        reject(e);
      }
    });
  }
/*
  async resetPassword(email, token, password) {
    return new Promise(async (resolve, reject) => {
      try {
        const decryptedEmail = this.encryptionService.decryptText(token || '');
        if (email !== decryptedEmail) {
          this.logwAndThrow('reset password - token/email mismatch', email, token, password);
        } else {
          const hashedPassword = this.encryptionService.getHashedPassword(password);
          const userDoc = await this.userService.updateOne({email}, {$set:{password: hashedPassword }}); // {new:true}
          if (!userDoc) this.logwAndThrow('reset password - document not found', email, token, password);
          resolve(userDoc);
        }
      } catch (e) {
        this.loge('error resetting password', e);
        reject(e);
      }
    });
  }
*/

  /***********************/
  /*   L O G I N         */
  /***********************/

  async validateUser(email: string, password: string): Promise<any> {
    return new Promise<LocalStrategyResponse>(async(resolve, reject) => {
      let message = '';
      let userDoc!: UserDoc;
      try {
        userDoc = await this.userService.findByEmail(email);
        if (!userDoc) {
          message = 'invalid user/password';
        } else if (userDoc.status !== UserStatus.Active) {
          message = 'user status is inactive';
        } else if (!this.arePasswordsMatch(password, userDoc.password)) {
          message = 'invalid user/password';
        }
      } catch(e) {
        this.loge('error validating user', e, email, password);
        message = e.message;
      }
      resolve(message ? { isLoginSuccess: false, message } : { isLoginSuccess: true, userDoc });
    });
  }

  getAuthProfile(userDoc: UserDoc) {
    const props = ['firstName', 'lastName', 'email', 'role'];
    return ZObj.clone(userDoc, props);
  }

  public arePasswordsMatch(password, hashedPassword) {
    return this.encryptionService.isPasswordMatchToHash(password, hashedPassword);
  }

  async getAccessToken(payload) {
    return this.jwtService.signAsync({ sub: payload }, { expiresIn: appConfig.auth.jwt.accessTokenExpiresIn });
  }

  async getRefreshToken(payload) {
    return new Promise<any>(async (resolve, reject) => {
      try {
        const opts = { expiresIn: appConfig.auth.jwt.refreshTokenExpiresIn };
        jwt.sign(payload, appConfig.auth.jwt.refreshTokenSecretKey, opts, (err, token) => {
          if (err) {
            reject(err);
          } else {
            resolve(token);
          }
        });
      } catch (e) {
        this.loge('error signing refresh token', e);
        reject(e);
      }
    });
  }

  async verifyRefreshToken(token) {
    return new Promise(async (resolve, reject) => {
      try {
        jwt.verify(token, appConfig.auth.jwt.refreshTokenSecretKey, (err, decoded) => {
          if (err) {
            resolve(null);
          } else {
            resolve(decoded);
          }
        });
      } catch (e) {
        this.loge('error verifying refresh token', e);
        reject(e);
      }
    });
  }
}
