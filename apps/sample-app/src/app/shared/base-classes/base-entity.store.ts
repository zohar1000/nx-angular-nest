import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { BaseService } from '@sample-app/shared/base-classes/base.service';
import { ListPageMetrics } from '@shared/models/list-page-metrics.model';

@Injectable()
export class BaseEntityStore extends BaseService {
  items$ = new BehaviorSubject<any[]>(null);
  totalCount$ = new BehaviorSubject<number>(0);
  currItem$ = new BehaviorSubject(null);
  listPageMetrics$ = new BehaviorSubject<ListPageMetrics>(null);
}
