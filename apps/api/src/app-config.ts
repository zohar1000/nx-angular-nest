import { AppConfig } from './shared/models/app-config.interface';

export let appConfig: AppConfig;
export const initAppConfig = (config: AppConfig) => appConfig = config;
