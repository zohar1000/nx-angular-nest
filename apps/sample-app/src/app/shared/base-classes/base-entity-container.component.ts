import { BaseEntityStore } from './base-entity.store';
import { BaseComponent } from '@sample-app/shared/base-classes/base.component';
import { ActivatedRoute } from '@angular/router';
import { Directive, OnInit } from '@angular/core';
import { RouteChangeData } from 'ng-route-change';
import { PageType } from '@sample-app/shared/enums/page-type.enum';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { ServerResponse } from '@shared/models/server-response.model';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { GetItemsRequest } from '@shared/models/get-items-request.model';
import { GetItemsResponse } from '@shared/models/get-items-response.model';
import { ListPageMetrics } from '@shared/models/list-page-metrics.model';
// import { appText } from '@sample-app/shared/consts/app-text.const';
import { Entity } from '@sample-app/shared/models/entity.model';

@Directive()
export abstract class BaseEntityContainerComponent extends BaseComponent {
  readonly DEFAULT_CONFIG = {
    isLoadItemsOnInit: true,
    isRefreshTotalCountOnEdit: true,
    isReturnItemsPageOnItemRequest: true
  };
  getItems$ = new ReplaySubject<GetItemsRequest>(1);
  config;
  PageType = PageType;
  pageType = '';
  isRefreshTotalCount = true;
  isLoading$ = new BehaviorSubject<boolean>(false);
  localStorageTableKey;
  entity: Entity;

  abstract getEntity(): Entity;

  constructor(public entityStore: BaseEntityStore,
              protected activatedRoute: ActivatedRoute) {
    super();
    this.entity = this.getEntity();
    this.localStorageTableKey = `table_${this.entity.key}`;
    this.initConfig();
    this.entityStore.init(this.localStorageTableKey, this.entity);
    if (this.config.isLoadItemsOnInit) this.entityStore.items$.next(null);
    this.regSub(this.getItems$.pipe(switchMap((request: GetItemsRequest) => this.sendItemsReqToServer(request))).subscribe());
  }

  initConfig() {
    this.config = { ...this.DEFAULT_CONFIG };
  }

  onRouteChange(data: RouteChangeData) {
    this.pageType = data.state.data ? data.state.data.pageType : '';
    switch (this.pageType) {
      case PageType.List:
        if (!this.entityStore.items$.value) this.getItems();
        break;
      case PageType.EditItem:
        this.entityStore.currItem$.next(null);
        this.regSub(this.getItem(data.state.params.id).subscribe());
        break;
    }
  }

  onChangeListPageMetrics(listPageMetrics: ListPageMetrics) {
    this.entityStore.listPageMetrics$.next(listPageMetrics);
    this.getItems();
  }


  /*******************************/
  /*      G E T   I T E M S      */
  /*******************************/

  getItem(id) {
    this.showAppSpinner();
    return this.apiService.get(`${this.getUrlPrefix()}/${id}`).pipe(
      finalize(() => this.hideAppSpinner()),
      tap((response: ServerResponse) => {
        if (response.isSuccess) {
          this.entityStore.currItem$.next(response.data);
        } else {
          this.logError(`Error getting ${this.entity.key} ${id}`, response);
          this.showErrorToastr(response.error?.message || `Error getting ${this.entity.key}`);
        }
      }));
  }

  getItems() {
    const request: GetItemsRequest = { ...this.entityStore.listPageMetrics$.value, isTotalCount: this.isRefreshTotalCount || this.entityStore.totalCount$.value === 0 } as GetItemsRequest;
    this.isRefreshTotalCount = true;
    this.getItems$.next(request);
  }

  sendItemsReqToServer(request: GetItemsRequest) {
    this.showAppSpinner();
    return this.apiService.post(`${this.getUrlPrefix()}/items-page`, request).pipe(
      finalize(() => this.hideAppSpinner()),
      tap((response: ServerResponse) => {
        if (response.isSuccess) {
          const data: GetItemsResponse = response.data as GetItemsResponse;
          this.nextPage(data.items, request.isTotalCount ? data.totalCount : -1);
        } else {
          this.logError(`Error getting items, entity: ${this.entity.key}`, response);
          this.showErrorToastr(response.error?.message || `Error getting ${this.entity.key} records`);
        }
      })
    )
  }


  /*********************************************************/
  /*      S U B M I T   A D D / E D I T / D E L E T E      */
  /*********************************************************/

  submitAddItem(data) {
    this.showAppSpinner();
    const { method, urlSuffix, params } = this.getRequestUrlAndParams('add', 'post', data);
    this.regSub(this.apiService[method](`${this.getUrlPrefix()}${urlSuffix}`, params)
      .pipe(
        tap((response: ServerResponse) => {
          if (response.isSuccess) {
            if (this.config.isReturnItemsPageOnItemRequest) {
              this.hideAppSpinner();
              this.nextPage(response.data.items, response.data.totalCount);
            } else {
              this.entityStore.items$.next(null);
            }
            this.showSuccessToastr(this.translate(this.appText$.value.success.itemWasAdded, { entity: this.entity.label, id: response.data.insertedId }));
            this.navigateTo(['.']);
          } else {
            this.hideAppSpinner();
            this.logError(`Error adding item, entity: ${this.entity.key}`, response);
            this.showErrorToastr(response.error?.message || `Error adding ${this.entity.key}`);
          }
        })
      ).subscribe());
  }

  submitEditItem({id, data}) {
    this.showAppSpinner();
    const { urlSuffix, method, params } = this.getRequestUrlAndParams('edit', 'put', data);
    this.regSub(this.apiService[method](`${this.getUrlPrefix()}/${id}${urlSuffix}`, params)
      .pipe(
        tap((response: ServerResponse) => {
          if (response.isSuccess) {
            if (this.config.isReturnItemsPageOnItemRequest) {
              this.nextPage(response.data.items, response.data.totalCount);
              this.hideAppSpinner();
            } else {
              this.entityStore.items$.next(null);
              this.isRefreshTotalCount = this.config.isRefreshTotalCountOnEdit;
            }
            this.showSuccessToastr(this.translate(this.appText$.value.success.itemWasUpdated, { entity: this.entity.label, id }));
            this.navigateTo(['.']);
          } else {
            this.hideAppSpinner();
            this.logError(`Error saving item ${id}, entity: ${this.entity.key}`, response);
            this.showErrorToastr(response.error?.message || `Error saving ${this.entity.key}`);
          }
        })
      ).subscribe());
  }

  submitDeleteItem(id) {
    this.showAppSpinner();
    const { urlSuffix, method, params } = this.getRequestUrlAndParams('delete', 'delete');
    this.regSub(this.apiService[method](`${this.getUrlPrefix()}/${id}${urlSuffix}`, params)
      .pipe(
        tap((response: ServerResponse) => {
          if (response.isSuccess) {
            if (this.config.isReturnItemsPageOnItemRequest) {
              this.hideAppSpinner();
              this.nextPage(response.data.items, response.data.totalCount);
            } else {
              this.getItems()
            }
            this.showSuccessToastr(this.translate(this.appText$.value.success.itemWasDeleted, { entity: this.entity.label, id }));
          } else {
            this.hideAppSpinner();
            this.logError(`Error deleting item ${id}, entity: ${this.entity.key}`, response);
            this.showErrorToastr(response.error?.message || `Error deleting ${this.entity.key}`);
          }
        })
      ).subscribe());
  }

  getRequestUrlAndParams(type: string, method, data?): { method: string, urlSuffix: string, params: any } {
    if (this.config.isReturnItemsPageOnItemRequest) {
      const isTotalCount = type !== 'edit' || this.config.isRefreshTotalCountOnEdit || this.entityStore.totalCount$.value === 0;
      return {
        method: 'post',
        urlSuffix: `/${type}-page`,
        params: {
          doc: data,
          getItemsRequest: { ...this.entityStore.listPageMetrics$.value, isTotalCount }
        }
      }
    } else {
      return {
        method,
        urlSuffix: '',
        params: data
      }
    }
  }

  nextPage(items, totalCount = -1) {
    this.entityStore.items$.next(items);
    if (totalCount !== -1) this.entityStore.totalCount$.next(totalCount);
  }


  /*****************************/
  /*      N A V I G A T E      */
  /*****************************/

  navigateToAddPage() {
    this.navigateTo(['add']);
  }

  navigateToEditPage(id) {
    this.entityStore.currItem$.next(null);
    this.navigateTo(['edit', id]);
  }

  onCancelItem() {
    this.navigateTo(['.']);
  }

  navigateTo(segments: string[]) {
    this.router.navigate(segments, { relativeTo: this.activatedRoute });
  }

  getUrlPrefix() {
    return `v1/${this.entity.key}`;
  }

  /*******************************************/
  /*      L O A D I N G   S P I N N E R      */
  /*******************************************/

  showAppSpinner() {
    this.isLoading$.next(true);
    super.showAppSpinner();
  }

  hideAppSpinner() {
    this.isLoading$.next(false);
    super.hideAppSpinner();
  }
}
