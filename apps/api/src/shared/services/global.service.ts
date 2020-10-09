import { Injectable } from '@nestjs/common';
import { ReplaySubject } from 'rxjs';
import { ErrorService } from './error.service';
import { FileService } from './file.service';
import { SanitationService } from './sanitation.service';
// import { AppEventsService }         from './app-events.service';
// import { MailService }              from './mail.service';
// import { RequestLogsService } from './db/request-logs.service';

@Injectable()
export class GlobalService {
  static globalService$ = new ReplaySubject(1);
  static errorService: ErrorService;
  static fileService: FileService;
  static sanitationService: SanitationService;

  // static appEventsService: AppEventsService;
  // static mailService: MailService;
  // static requestLogsService: RequestLogsService;
}
