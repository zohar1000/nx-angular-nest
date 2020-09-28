import { BehaviorSubject } from 'rxjs';
import { Injectable, OnInit } from '@angular/core';
import { BaseService } from '@sample-app/shared/base-classes/base.service';
import { ListPageMetrics } from '@shared/models/list-page-metrics.model';
import { LocalStorageTable } from '@shared/models/local-storage-table.mode';
import { LocalStorageService } from '@sample-app/core/services/local-storage.service';
import { appInjector } from '@sample-app/app.injector';
import { SortMetrics } from '@sample-app/shared/models/sort-metrics.model';
import { PagingMetrics } from '@sample-app/shared/models/paging-metrics.model';

@Injectable()
export class BaseEntityStore extends BaseService {
  readonly DEFAULT_PAGE_SIZE = 10;
  readonly INITIAL_PAGING_METRICS: PagingMetrics = { pageIndex: 0, pageSize: this.DEFAULT_PAGE_SIZE };
  readonly INITIAL_SORT_METRICS: SortMetrics = { key: 'id', order: 1 };
  items$ = new BehaviorSubject<any[]>(null);
  totalCount$ = new BehaviorSubject<number>(0);
  currItem$ = new BehaviorSubject(null);
  listPageMetrics$ = new BehaviorSubject<ListPageMetrics>(null);
  localStorageService: LocalStorageService;

  init(localStorageTableKey, filter) {
    this.localStorageService = appInjector.get(LocalStorageService);
    this.initListPageMetricsFromLocalStorage(localStorageTableKey, filter);
  }

  /***************************************/
  /*      L O C A L   S T O R A G E      */
  /***************************************/

  initListPageMetricsFromLocalStorage(localStorageTableKey, filter) {
    const item: LocalStorageTable = this.localStorageService.getJsonItem(localStorageTableKey);
    const sort: SortMetrics = item && item.sortMetrics ? item.sortMetrics : { ...this.INITIAL_SORT_METRICS };
    const paging: PagingMetrics = { ...this.INITIAL_PAGING_METRICS };
    const pageSize = this.localStorageService.getItem(LocalStorageService.PAGE_SIZE);
    paging.pageSize = pageSize ? Number(pageSize) : this.DEFAULT_PAGE_SIZE;
    this.listPageMetrics$.next({ filter, paging, sort });
  }

  // updateLocalStorage() {
  //   const item: LocalStorageTable = this.localStorageService.getJsonItem(this.localStorageTableKey) || {};
  //   item.sortMetrics = this.sortMetrics;
  //   item.pageIndex = this.pagingMetrics.pageIndex;
  //   this.localStorageService.setJsonItem(this.localStorageTableKey, item);
  //   this.localStorageService.setItem(LocalStorageService.PAGE_SIZE, this.pagingMetrics.pageSize);
  // }

}
