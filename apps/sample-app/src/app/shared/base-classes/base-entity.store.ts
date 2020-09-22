import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { BaseService } from '@sample-app/shared/base-classes/base.service';
import { PagingSettings } from '@sample-app/shared/models/paging-settings.model';
import { SortSettings } from '@sample-app/shared/models/sort-settings.model';
import { LocalStorageService } from '@sample-app/core/services/local-storage.service';
import { appInjector } from '@sample-app/app.injector';
import { ItemsPageSettings } from '@shared/models/items-page-settings.model';

@Injectable()
export class BaseEntityStore extends BaseService {
  readonly INITIAL_PAGING: PagingSettings = { pageIndex: 0, pageSize: 10 };
  readonly INITIAL_SORT: SortSettings = { key: 'id', order: 1 };
  items$ = new BehaviorSubject<any[]>(null);
  totalCount$ = new BehaviorSubject<number>(0);
  currItem$ = new BehaviorSubject(null);
  paging: PagingSettings;
  filter;
  sort: SortSettings;
  localStorageTableKey;
  localStorageService: LocalStorageService;

  init(entityKey) {
    this.localStorageTableKey = `table_${entityKey}`;
    this.localStorageService = appInjector.get(LocalStorageService);
    this.initItemsPageSettingsFromLocalStorage();
  }

  getItemsPageSettings(): ItemsPageSettings {
    return {paging: this.paging, filter: this.filter, sort: this.sort };
  }

  /***************************************/
  /*      L O C A L   S T O R A G E      */
  /***************************************/

  initItemsPageSettingsFromLocalStorage() {
    const item = this.localStorageService.getJsonItem(this.localStorageTableKey);
    this.sort = item && item.sortSettings ? item.sortSettings : { ...this.INITIAL_SORT };
    this.paging = { ...this.INITIAL_PAGING };
    const pageSize = this.localStorageService.getItem(LocalStorageService.PAGE_SIZE);
    if (pageSize) this.paging.pageSize = Number(pageSize);
    this.filter = {};
  }

  storePageSizeInLocalStorage() {
    this.localStorageService.setItem(LocalStorageService.PAGE_SIZE, this.paging.pageSize);
  }

  storeSortSettingsInLocalStorage() {
    let item = this.localStorageService.getJsonItem(this.localStorageTableKey);
    if (!item) item = {};
    item.sortSettings = this.sort;
    this.localStorageService.setJsonItem(this.localStorageTableKey, item);
  }

  updateLocalStorage() {
    this.storePageSizeInLocalStorage();
    this.storeSortSettingsInLocalStorage();
  }
}
