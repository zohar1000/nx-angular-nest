import { BaseEntityService } from './base-entity.service';
import { BaseComponent } from '@sample-app/shared/base-classes/base.component';
import { ActivatedRoute } from '@angular/router';
import { Directive, OnInit } from '@angular/core';
import { RouteChangeData } from 'ng-route-change';
import { PageType } from '@sample-app/shared/enums/page-type.enum';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { ServerResponse } from '@shared/models/server-response.model';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { PagingSettings } from '@sample-app/shared/models/paging-settings.model';
import { SortSettings } from '@sample-app/shared/models/sort-settings.model';
import { LocalStorageService } from '@sample-app/core/services/local-storage.service';
import { appInjector } from '@sample-app/app.injector';

// TODO:
// implement onServerResponseError

@Directive()
export abstract class BaseEntityContainerComponent extends BaseComponent implements OnInit {
  readonly INITIAL_PAGING: PagingSettings = { pageIndex: 0, pageSize: 10 };
  readonly INITIAL_SORT: SortSettings = { key: 'id', order: 1 };
  readonly DEFAULT_CONFIG = { isLoadItemsOnInit: true, isRefreshTotalCountOnEdit: false };
  pageType = '';
  PageType = PageType;
  items$ = new BehaviorSubject(null);
  currItem$ = new BehaviorSubject(null);
  totalCount$ = new BehaviorSubject(0);
  paging: PagingSettings;
  filter;
  sort: SortSettings;
  pageSettings$ = new ReplaySubject(1);
  localStorageTableKey;
  localStorageService: LocalStorageService;
  isRefreshTotalCount = true;
  config;
  isUpdateLocalStorage = false;

  constructor(protected entityKey: string,
              protected entityService: BaseEntityService,
              private activatedRoute: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.localStorageService = appInjector.get(LocalStorageService);
    this.localStorageTableKey = `table_${this.entityKey}`;
    this.initConfig();
    this.initPageSettingsFromLocalStorage();
    this.currItem$ = this.entityService.items$;  //   new BehaviorSubject(null);
    this.totalCount$ = this.entityService.totalCount$;  //  = new BehaviorSubject(0);
    if (this.config.isLoadItemsOnInit) this.items$.next(null);
    this.regSub(this.pageSettings$.pipe(switchMap(paging => this.sendPageReqToServer(paging))).subscribe(
      () => {},
      (e: HttpErrorResponse) => {
        if (e.status === 401) return;
        this.logError(`Error getting items, entity: ${this.entityKey}`, e);
        this.showErrorToastr(`Error getting ${this.entityKey}`);
      }
    ));
  }

  initConfig() {
    this.config = { ...this.DEFAULT_CONFIG };
  }

  onRouteChange(data: RouteChangeData) {
    const pageType = data.state.data ? data.state.data.pageType : '';
    if (!pageType) return;
    this.pageType = pageType;
    switch (pageType) {
      case PageType.List:
        if (!this.items$.value) this.getPage();
        break;
      case PageType.EditItem:
        this.currItem$.next(null);
        this.regSub(this.getItem(data.state.params.id).subscribe(response => this.currItem$.next(response)));
        break;
    }
  }


  /*******************************/
  /*      G E T   I T E M S      */
  /*******************************/

  getItem(id) {
    console.log('get item');
    this.showAppSpinner();
    return this.apiService.get(`${this.getUrlPrefix()}/${id}`).pipe(
      finalize(() => this.hideAppSpinner()),
      tap((response: ServerResponse) => {
        if (response.isSuccess) {
          this.currItem$.next(response.data);
        } else {
          this.logError(`Error getting ${this.entityKey} ${id}, message: ${response.error.message}`);
          this.showErrorToastr(`Error getting ${this.entityKey}`);
        }
      }));
  }

  getItems() {
    console.log('get items');
    this.showAppSpinner();
    return this.apiService.get(this.getUrlPrefix()).pipe(
      finalize(() => this.hideAppSpinner()),
      tap((response: ServerResponse) => {
        if (response.isSuccess) {
          this.items$.next(response.data);
        } else {
          this.logError(`Error getting items, entity: ${this.entityKey}, message: ${response.error.message}`);
          this.showErrorToastr(`Error getting ${this.entityKey} records`);
        }
      }));
  }

  getPageByPageIndex(pageIndex) {
    this.paging.pageIndex = pageIndex;
    this.getPage();
  }

  getPageByPageSize(pageSize) {
    this.isUpdateLocalStorage = true;
    this.paging.pageSize = pageSize;
    this.getPage();
  }

  getPageBySort({key, order}) {
    this.isUpdateLocalStorage = true;
    this.sort.key = key;
    this.sort.order = order;
    this.getPage();
  }

  getPage() {
    const isRefreshTotalCount = this.isRefreshTotalCount;
    this.isRefreshTotalCount = true;
    const paging = { paging: this.paging, filter: this.filter, sort: this.sort, isTotalCount: isRefreshTotalCount }
    this.pageSettings$.next(paging);
  }

  sendPageReqToServer(paging) {
console.log('get page settings:', JSON.stringify(paging));
    this.showAppSpinner();
    return this.apiService.post(`${this.getUrlPrefix()}/page`, paging).pipe(
      finalize(() => { this.hideAppSpinner(); this.isUpdateLocalStorage = false; }),
      tap((response: ServerResponse) => {
        if (response.isSuccess) {
          this.items$.next(response.data.items);
          if (paging.isTotalCount) this.totalCount$.next(response.data.totalCount);
          if (this.isUpdateLocalStorage) this.updateLocalStorage();
        } else {
          this.logError(`Error getting items, entity: ${this.entityKey}, message: ${response.error.message}`);
          this.showErrorToastr(`Error getting ${this.entityKey} records`);
        }
      })
    )
  }


  /*********************************************************/
  /*      S U B M I T   A D D / E D I T / D E L E T E      */
  /*********************************************************/

  submitAddItem(data) {
    console.log('submit add item');
    this.showAppSpinner();
    this.regSub(this.apiService.post(`${this.getUrlPrefix()}`, data)
      .pipe(
        tap((response: ServerResponse) => {
          if (response.isSuccess) {
            this.items$.next(null);
            this.navigateTo(['.']);
          } else {
            this.hideAppSpinner();
            this.logError(`Error adding item, entity: ${this.entityKey}, message: ${response.error.message}`);
            this.showErrorToastr(`Error adding ${this.entityKey}`);
          }
        })
      ).subscribe(() => {}));
  }

  submitEditItem({id, data}) {
    console.log('submit edit item');
    this.showAppSpinner();
    this.regSub(this.apiService.put(`${this.getUrlPrefix()}/${id}`, data)
      .pipe(
        tap((response: ServerResponse) => {
          if (response.isSuccess) {
            this.items$.next(null);
            if (!this.config.isRefreshTotalCountOnEdit) this.isRefreshTotalCount = false;
            this.navigateTo(['.']);
          } else {
            this.hideAppSpinner();
            this.logError(`Error saving item ${id}, entity: ${this.entityKey}, message: ${response.error.message}`);
            this.showErrorToastr(`Error saving ${this.entityKey}`);
          }
        })
      ).subscribe(() => {}));
  }

  submitDeleteItem(id) {
    this.showAppSpinner();
    this.regSub(this.apiService.delete(`${this.getUrlPrefix()}/${id}`)
      .pipe(
        tap((response: ServerResponse) => {
          if (response.isSuccess) {
            this.getPage()
          } else {
            this.hideAppSpinner();
            this.logError(`Error deleting item ${id}, entity: ${this.entityKey}, message: ${response.error.message}`);
            this.showErrorToastr(`Error deleting ${this.entityKey}`);
          }
        })
      ).subscribe(() => {}));
  }

  /*****************************/
  /*      N A V I G A T E      */
  /*****************************/

  navigateToAddPage() {
    this.navigateTo(['add']);
  }

  navigateToEditPage(id) {
    this.currItem$.next(null);
    this.navigateTo(['edit', id]);
  }

  onCancelItem() {
    this.navigateTo(['.']);
  }

  navigateTo(segments: string[]) {
    this.router.navigate(segments, { relativeTo: this.activatedRoute });
  }

  /***************************************/
  /*      L O C A L   S T O R A G E      */
  /***************************************/

  initPageSettingsFromLocalStorage() {
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

  getUrlPrefix() {
    return `v1/${this.entityKey}`;
  }

}
