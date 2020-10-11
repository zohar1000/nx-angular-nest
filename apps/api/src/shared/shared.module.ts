import { Global, Module } from '@nestjs/common';
import { ErrorService } from './services/error.service';
import { FileService } from './services/file.service';
import { SanitationService } from './services/sanitation.service';
import { EncryptionService } from './services/encryption.service';
import { UserService } from './services/entities/user.service';
import { ZMongoService } from 'zshared-server';
import { UserModule } from '../routes/user/user.module';
import { GlobalService } from '@api-app/shared/services/global.service';

const globalServicesFactory = {
  provide: 'GLOBAL_SERVICES',
  useFactory: (globalService: GlobalService,
               errorService: ErrorService,
               fileService: FileService,
               sanitationService: SanitationService,
               // appEventsService: AppEventsService,
               // mailService: MailService,
               // requestLogsService: RequestLogsService
  ) => {
    GlobalService.errorService = errorService;
    GlobalService.fileService = fileService;
    GlobalService.sanitationService = sanitationService;
    // GlobalService.appEventsService = appEventsService;
    // GlobalService.mailService = mailService;
    // GlobalService.requestLogsService = requestLogsService;
    const globalServices = { errorService, sanitationService, fileService };
    GlobalService.globalService$.next(globalServices);
    return;
  },
  inject: [GlobalService, ErrorService, FileService, SanitationService]
};
const services = [
  // { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },

  EncryptionService,
  ErrorService,
  // MailService,
  FileService,
  SanitationService,
  // MemberRolesGuard,
  // ObjUtils,
  // AppEventsService,
  GlobalService,
  globalServicesFactory,

  // db
  UserService,

  ZMongoService
  // { provide: ZMongoService, useValue: ZMongoService.getNewInstance()
];

@Global()
@Module({
  imports: [
/*    MongooseModule.forFeature([
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
