import { appConfig } from '../../app-config';
import { Injectable } from '@nestjs/common';

const crypto = require('crypto');

@Injectable()
export class EncryptionService {
  encryptionConfig;
  passwordConfig;
  bufferedConfirmationEncKey;

  constructor() {
    this.encryptionConfig = appConfig.encryption;
    this.passwordConfig = this.encryptionConfig.password;
    this.bufferedConfirmationEncKey = Buffer.from(this.encryptionConfig.key);
  }

  /*****************/
  /*   T E X T     */
  /*****************/

  encryptText(text): string {
    const iv = crypto.randomBytes(this.encryptionConfig.ivLen);
    const cipher = crypto.createCipheriv(this.encryptionConfig.algorithm, Buffer.from(this.bufferedConfirmationEncKey), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + encrypted.toString('hex');
  }

  decryptText(token): string {
    const iv = Buffer.from(token.substr(0, this.encryptionConfig.ivLen * 2), 'hex');
    const encryptedText = Buffer.from(token.substr(this.encryptionConfig.ivLen * 2), 'hex');
    const decipher = crypto.createDecipheriv(this.encryptionConfig.algorithm, Buffer.from(this.bufferedConfirmationEncKey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }

  /*************************/
  /*   P A S S W O R D     */
  /*************************/

  public getHashedPassword(text) {
    const salt = crypto.randomBytes(Math.ceil(this.passwordConfig.saltSize/2))
      .toString(this.passwordConfig.saltFormat) /** convert to hexadecimal format */
      .slice(0, this.passwordConfig.saltSize);   /** return required number of characters */
    const hash = this.getHash(text, salt, this.passwordConfig.saltFormat, this.passwordConfig.algorithm);
    return { hash, salt };
  }

  public isPasswordMatchToHash(text, hashedText) {
    const hash = this.getHash(text, hashedText.salt, this.passwordConfig.saltFormat, this.passwordConfig.algorithm);
    return hash === hashedText.hash;
  }

  private getHash(text, salt, saltFormat, algorithm) {
    const hmac = crypto.createHmac(algorithm, salt);
    hmac.update(text);
    return hmac.digest(saltFormat);
  }
}
