import { AppConfig } from './shared/models/app-config.interface';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const compression = require('compression');
const morgan = require('morgan');
import { Logger } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { appConfig$ } from './shared/services/config.service';
import { HttpExceptionFilter } from './shared/exception-filters/http-exception.filter';

async function bootstrap() {
  let appConfig!: AppConfig;
  appConfig$.once('appConfig', response => appConfig = response);
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
