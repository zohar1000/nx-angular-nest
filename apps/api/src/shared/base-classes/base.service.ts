import { EventEmitter } from 'events';
const mongodb = require('mongodb');
import { ErrorService } from '../services/error.service';
import { GlobalService } from '@api-app/shared/services/global.service';
import { FileService } from '@api-app/shared/services/file.service';
import { SanitationService } from '@api-app/shared/services/sanitation.service';
import { take } from 'rxjs/operators';
// import { GlobalService}      from './global.service';
// import { MailService }       from './mail.service';
// import { SanitationService } from './sanitation.service';
// import { FileService }       from './file.service';
// import { Role } from '../enums/role.enum';

export abstract class BaseService extends EventEmitter {
  protected errorService: ErrorService;
  protected fileService: FileService;
  protected sanitationService: SanitationService;
  // protected mailService: MailService;


  protected constructor() {
    super();
    this.init();
  }

  init() {
    const subscription = GlobalService.globalService$.pipe(take(1)).subscribe((globalServices: any) => {
      this.errorService = globalServices.errorService;
      this.fileService = globalServices.fileService;
      this.sanitationService = globalServices.sanitationService;
      // this.appEventsService = globalServices.appEventsService;
      // this.mailService = globalServices.mailService;
      setTimeout(() => {
        subscription.unsubscribe();
      });
    });
  }

  logeAndThrow(...params) {
    const errorEvent = this.errorService.loge(...params);
    throw Error(errorEvent);
  }

  logwAndThrow(...params) {
    const errorEvent = this.errorService.logw(...params);
    throw Error(errorEvent);
  }

  logiAndThrow(...params) {
    const errorEvent = this.errorService.logi(...params);
    throw Error(errorEvent);
  }

  loge(...params) {
    this.errorService.loge(...params);
  }

  logw(...params) {
    this.errorService.logw(...params);
  }

  logi(...params) {
    this.errorService.logi(...params);
  }

  throw(message: string) {
    throw new Error(message);
  }

  // protected isSuperUser(role) {
  //   return [Role.Manager, Role.Support].includes(role);
  // }


  /***********************/
  /*    U T I L S        */
  /***********************/

  protected getObjectId(id: string) {
    return new mongodb.ObjectID(id);
  }

  protected verifyMongoQueryArrayValue(query, key) {
    const value = query[key];
    if (value && Array.isArray(value)) query[key] = (value.length === 1 ? value[0] : { $in: value });
  }

  protected getMongoQueryValue(value) {
    return Array.isArray(value) ? (value.length === 1 ? value[0] : { $in: value }) : value;
  }

}
