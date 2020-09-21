import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { BaseService } from '@sample-app/shared/base-classes/base.service';

// TODO:
// regSub to all subscribers
// implement total count
// implement onServerResponseError
// change toastr error messages to include entity

@Injectable()
export class BaseEntityService extends BaseService {
  public items$ = new BehaviorSubject(null);
  public totalCount$ = new BehaviorSubject(0);
}
