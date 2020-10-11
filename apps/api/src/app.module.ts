import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ZMongoService } from 'zshared-server';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import { AuthModule } from './routes/auth/auth.module';
import { appConfig } from './app-config';

@Global()
@Module({
  imports: [
    AuthModule,
    SharedModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor }
  ]
})
export class AppModule {
  constructor(mongoService: ZMongoService) {
    const mongoConfig = appConfig.mongo;
    mongoService.init(mongoConfig.connStr, mongoConfig.dbName);
  }
}
