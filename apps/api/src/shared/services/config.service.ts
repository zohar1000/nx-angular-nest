import { Injectable } from '@nestjs/common';
import { AppConfig }     from '../models/app-config.interface';
import { environment } from '../../environments/environment';
const path = require('path');
const fs = require('fs');
const JSON5 = require('json5');
const events = require('events');
// export const pm2InstanceId = Number(process.env.INSTANCE_ID || '0');
export let appConfig: AppConfig;
export const appConfig$ = new events.EventEmitter();

@Injectable()
export class ConfigService {
  // static let AppConfig: A;
  appConfig: AppConfig;
  appFolder: string;
  // pm2InstanceId = Number(process.env.INSTANCE_ID || '0');

  constructor() {
    this.appFolder = path.join(process.cwd(), environment.appFolder);
    this.readConfigFile();
  }

  readConfigFile() {
    const configFilePath = path.join(this.appFolder, environment.configFileName);
    const fileText = fs.readFileSync(configFilePath, 'utf8');
    this.appConfig = JSON5.parse(fileText);
    appConfig = this.appConfig;
    appConfig$.emit('appConfig', this.appConfig);
  }

  // static isFirstPm2Process() {
  //   return Number(process.env.INSTANCE_ID || '0') === 0;
  // }

  isProdEnv() {
    return this.appConfig.env === 'production';
  }

  getBrandName() {
    return this.appConfig.brandName;
  }

  getHost() {
    return this.appConfig.host;
  }

  getPaths() {
    return this.appConfig.paths;
  }

  getAuthJwt() {
    return this.appConfig.auth.jwt;
  }

  getConsole() {
    return this.appConfig.console;
  }

  getSimulation() {
    return this.appConfig.simulation;
  }

  getMail() {
    return this.appConfig.mail;
  }

  getEncryption() {
    return this.appConfig.encryption;
  }
}
