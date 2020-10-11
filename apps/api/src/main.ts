import { initAppConfig } from './app-config';
import { environment } from './environments/environment';
const path = require('path');
const fs = require('fs');
const JSON5 = require('json5');
const APP_CONFIG_FILE_NAME = 'app-config.json5';

async function bootstrap() {
  setAppConfig();
  const mainModule: any = require('./main.module');
  await mainModule.mainModule.init();
}

const setAppConfig = () => {
  const appConfigFilePath = path.join(process.cwd(), environment.appFolder, APP_CONFIG_FILE_NAME);
  const fileText = fs.readFileSync(appConfigFilePath, 'utf8');
  initAppConfig(JSON5.parse(fileText));
}

bootstrap();
