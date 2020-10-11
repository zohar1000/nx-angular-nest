import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { BaseService } from '@sample-app/shared/base-classes/base.service';
import { ListPageMetrics } from '@shared/models/list-page-metrics.model';
import { LocalStorageTable } from '@shared/models/local-storage-table.model';
import { LocalStorageService } from '@sample-app/core/services/local-storage.service';
import { appInjector } from '@sample-app/app.injector';
import { SortMetrics } from '@sample-app/shared/models/sort-metrics.model';
import { PagingMetrics } from '@sample-app/shared/models/paging-metrics.model';
import { Entity } from '@sample-app/shared/models/entity.model';

@Injectable()
export class BaseEntityStore extends BaseService {
  readonly DEFAULT_PAGE_SIZE = 10;
  readonly INITIAL_PAGING_METRICS: PagingMetrics = { pageIndex: 0, pageSize: this.DEFAULT_PAGE_SIZE };
  readonly INITIAL_SORT_METRICS: SortMetrics = { key: 'id', order: 1 };
  items$ = new BehaviorSubject<any[] | null>(null);
  totalCount$ = new BehaviorSubject<number>(0);
  currItem$ = new BehaviorSubject(null);
  listPageMetrics$: BehaviorSubject<ListPageMetrics>;
  localStorageService: LocalStorageService;

  init(localStorageTableKey, entity: Entity) {
    this.localStorageService = appInjector.get(LocalStorageService);
    this.initListPageMetricsFromLocalStorage(localStorageTableKey, entity);
  }

  /***************************************/
  /*      L O C A L   S T O R A G E      */
  /***************************************/

  initListPageMetricsFromLocalStorage(localStorageTableKey, entity: Entity) {
    const item: LocalStorageTable = this.localStorageService.getJsonItem(localStorageTableKey);
    const sort: SortMetrics = item && item.sortMetrics ? item.sortMetrics : { ...this.INITIAL_SORT_METRICS };
    const paging: PagingMetrics = { ...this.INITIAL_PAGING_METRICS };
    const pageSize = this.localStorageService.getItem(LocalStorageService.PAGE_SIZE);
    paging.pageSize = pageSize ? Number(pageSize) : this.DEFAULT_PAGE_SIZE;
    this.listPageMetrics$ = new BehaviorSubject({ filter: entity.initialFilter, paging, sort });
  }
}
