import { Injectable } from '@angular/core';
import { AppEventType } from '../../shared/enums/app-event-type.enum';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AppEventsService {
  subjects = {
    [AppEventType.ShowAppSpinner]: new Subject(),
    [AppEventType.HideAppSpinner]: new Subject()
  }

  sendAppEvent(type: AppEventType, data?) {
    const subject = this.subjects[type];
    subject.next(data);
  }

  getObsaervable(type: AppEventType): Observable<any> {
    const subject = this.subjects[type];
    return subject as Observable<any>;
  }
}
