import { Global, Module } from '@nestjs/common';
import { ErrorService } from './services/error.service';
import { FileService } from './services/file.service';
import { SanitationService } from './services/sanitation.service';
import { EncryptionService } from './services/encryption.service';
import { UserService } from './services/entities/user.service';
import { ZMongoService } from 'zshared-server';
// import { environment } from '../environments/environment';
import { UserModule } from '../routes/user/user.module';
// import { APP_INTERCEPTOR } from '@nestjs/core';
// import { TransformInterceptor } from './interceptors/transform.interceptor';

const services = [
  // { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },

  EncryptionService,
  ErrorService,
  // MailService,
  FileService,
  SanitationService,
  // RolesGuard,
  // ObjUtils,
  // AppEventsService,
  // globalServicesFactory,

  // db
  UserService,

  ZMongoService
  // { provide: ZMongoService, useValue: ZMongoService.getNewInstance()
];

@Global()
@Module({
  imports: [
/*    MongooseModule.forFeature([
      { name: 'resellers', schema: ResellerSchema },
      { name: 'locations', schema: LocationSchema },
      { name: 'devices', schema: DeviceSchema },
      { name: 'device-events', schema: DeviceEventSchema },
      { name: 'bottle-histories', schema: BottleHistorySchema },
      { name: 'software-versions', schema: SoftwareVersionSchema },
      { name: 'request-logs', schema: RequestLogSchema },
      { name: 'keepalive-logs', schema: KeepaliveLogSchema },
      { name: 'users', schema: UserSchema }
    ])*/

    UserModule
  ],
  providers: services,
  exports: services
})
export class SharedModule {}
