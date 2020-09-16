import { AppModule } from './app.module';

// const express = require('express');
const path = require('path');
// const bodyParser = require('body-parser');
// const compression = require('compression');
// const morgan = require('morgan');
// import * as helmet from 'helmet';
// import { HttpExceptionFilter } from './shared/exception-filters/http-exception.filter';
// import { environment } from './environments/environment';
import { appConfig, initAppConfig } from './app-config';
// import { Logger } from '@nestjs/common';
// import { AppModule } from './app.module';

import { NestApplication, NestFactory } from '@nestjs/core';
import { environment } from './environments/environment';
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
