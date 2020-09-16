const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const compression = require('compression');
const morgan = require('morgan');
import { Logger } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import * as helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/exception-filters/http-exception.filter';
import { appConfig } from './app-config';

export class MainModule {
  async init() {
    const app: NestApplication = await NestFactory.create(AppModule);
    this.setSecurity(app);
    this.setStaticFiles(app);
    this.setMiddlewares(app);
    this.setRequestHandling(app);

    app.setGlobalPrefix(appConfig.globalApiPrefix);
    await app.listen(appConfig.port, () => {
      Logger.log(`Server is up and listening at http://localhost:${appConfig.port}/${appConfig.globalApiPrefix}`);
    });
  }

  setSecurity(app) {
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

  setStaticFiles(app) {
    app.use(express.static(path.join(process.cwd(), './dist/')));
    app.use('/assets', express.static(path.resolve(process.cwd(), appConfig.paths.assetsFolder)));
    app.use('/favicon.ico', (req, res) => {
      res.setHeader('Content-Length', '0');
      res.setHeader('Content-Type', 'image/x-icon');
      res.end();
    });
  }

  setMiddlewares(app) {
    // app.useGlobalGuards(new RequestLogsGuard());
    // app.useGlobalInterceptors(new TransformInterceptor());
    // app.use(LoggerMiddleware);
    app.useGlobalFilters(new HttpExceptionFilter());
  }

  setRequestHandling(app) {
    app.use(morgan('dev'));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(compression());
  }
}

export const mainModule = new MainModule();
