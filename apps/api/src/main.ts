import { AppConfig } from './shared/models/app-config.interface';

const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const compression = require('compression');
const morgan = require('morgan');
import { Logger } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
const JSON5 = require('json5');
import { AppModule } from './app.module';
import { appConfig$ } from './shared/services/config.service';
import { HttpExceptionFilter } from './shared/exception-filters/http-exception.filter';
import { environment } from './environments/environment';
import { appConfig, initAppConfig } from './app-config';
const APP_CONFIG_FILE_NAME = 'app-config.json5';

async function bootstrap() {
  setAppConfig();
  const app: NestApplication = await NestFactory.create(AppModule);
  setSecurity(app);
  setStaticFiles(app, appConfig);
  setMiddlewares(app);
  setRequestHandling(app);

  app.setGlobalPrefix(appConfig.globalApiPrefix);
  await app.listen(appConfig.port, () => {
    Logger.log(`Server is up and listening at http://localhost:${appConfig.port}/${appConfig.globalApiPrefix}`);
  });
}

const setAppConfig = () => {
  const appConfigFilePath = path.join(process.cwd(), environment.appFolder, APP_CONFIG_FILE_NAME);
  const fileText = fs.readFileSync(appConfigFilePath, 'utf8');
  const config: AppConfig = JSON5.parse(fileText);
  initAppConfig(config);
}

const setSecurity = app => {
  app.enableCors();
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ['\'self\''],
        styleSrc: ['\'self\''],
        scriptSrc: ['\'self\''],
        fontSrc: ['\'self\''],
        reportUri: '/report-violation',
        objectSrc: ['\'self\''],
        // upgradeInsecureRequests: true
      }
    },
    referrerPolicy: { policy: 'same-origin' }
  }));
}

const setStaticFiles = (app, appConfig) => {
  app.use(express.static(path.join(process.cwd(), './dist/')));
  app.use('/assets', express.static(path.resolve(process.cwd(), appConfig.paths.assetsFolder)));
  app.use('/favicon.ico', (req, res) => {
    res.setHeader('Content-Length', '0');
    res.setHeader('Content-Type', 'image/x-icon');
    res.end();
  });
}

const setMiddlewares = app => {
  // app.useGlobalGuards(new RequestLogsGuard());
  // app.useGlobalInterceptors(new TransformInterceptor());
  // app.use(LoggerMiddleware);
  app.useGlobalFilters(new HttpExceptionFilter());
}

const setRequestHandling = app => {
  app.use(morgan('dev'));
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(compression());
}

bootstrap();
