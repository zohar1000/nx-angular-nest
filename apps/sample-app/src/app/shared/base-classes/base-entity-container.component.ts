import { BaseEntityStore } from './base-entity.store';
import { BaseComponent } from '@sample-app/shared/base-classes/base.component';
import { ActivatedRoute } from '@angular/router';
import { Directive, OnInit } from '@angular/core';
import { RouteChangeData } from 'ng-route-change';
import { PageType } from '@sample-app/shared/enums/page-type.enum';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { ServerResponse } from '@shared/models/server-response.model';
import { ReplaySubject } from 'rxjs';
import { GetItemsRequest } from '@shared/models/get-items-request.model';
import { GetItemsResponse } from '@shared/models/get-items-response.model';
import { ItemsPageSettings } from '@shared/models/items-page-settings.model';

@Directive()
export abstract class BaseEntityContainerComponent extends BaseComponent implements OnInit {
  readonly DEFAULT_CONFIG = {
    isLoadItemsOnInit: true,
    isRefreshTotalCountOnEdit: false,
    isReturnItemsPageOnItemRequest: false
  };
  getItemsRequest$ = new ReplaySubject<GetItemsRequest>(1);
  config;
  PageType = PageType;
  pageType = '';
  isRefreshTotalCount = true;
  isUpdateLocalStorage = false;

  constructor(protected entityKey: string,
              public entityStore: BaseEntityStore,
              protected activatedRoute: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.entityStore.init(this.entityKey);
    this.initConfig();
    if (this.config.isLoadItemsOnInit) this.entityStore.items$.next(null);
    this.regSub(this.getItemsRequest$.pipe(switchMap(settings => this.sendItemsReqToServer(settings))).subscribe());
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
          this.entityStore.currItem$.next(response.data);
        } else {
          this.logError(`Error getting ${this.entityKey} ${id}`, response);
          this.showErrorToastr(`Error getting ${this.entityKey}`);
        }
      }));
  }

  getItemsByPageIndex(pageIndex) {
    this.entityStore.paging.pageIndex = pageIndex;
    this.getItems();
  }

  getItemsByPageSize(pageSize) {
    this.isUpdateLocalStorage = true;
    this.entityStore.paging.pageSize = pageSize;
    this.getItems();
  }

  getItemsBySort({key, order}) {
    this.isUpdateLocalStorage = true;
    this.entityStore.sort.key = key;
    this.entityStore.sort.order = order;
    this.getItems();
  }

  getItems() {
    const isRefreshTotalCount = this.isRefreshTotalCount;
    const settings: ItemsPageSettings = this.entityStore.getItemsPageSettings();
    const getItemsRequest: GetItemsRequest = { ...settings, isTotalCount: isRefreshTotalCount };
    this.isRefreshTotalCount = true;
    this.getItemsRequest$.next(getItemsRequest);
  }

  sendItemsReqToServer(paging) {
    this.showAppSpinner();
    return this.apiService.post(`${this.getUrlPrefix()}/items-page`, paging).pipe(
      finalize(() => { this.hideAppSpinner(); this.isUpdateLocalStorage = false; }),
      tap((response: ServerResponse) => {
        if (response.isSuccess) {
          const data: GetItemsResponse = response.data as GetItemsResponse;
          this.entityStore.items$.next(data.items);
          if (paging.isTotalCount) this.entityStore.totalCount$.next(data.totalCount);
          if (this.isUpdateLocalStorage) this.entityStore.updateLocalStorage();
        } else {
          this.logError(`Error getting items, entity: ${this.entityKey}`, response);
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
    const { method, urlSuffix, params } = this.getRequestUrlAndParams('add', 'post', data);
    this.regSub(this.apiService[method](`${this.getUrlPrefix()}${urlSuffix}`, params)
      .pipe(
        tap((response: ServerResponse) => {
          if (response.isSuccess) {
            if (this.config.isReturnItemsPageOnItemRequest) {
              this.hideAppSpinner();
              this.entityStore.items$.next(response.data.items);
              this.entityStore.totalCount$.next(response.data.totalCount);
            } else {
              this.entityStore.items$.next(null);
            }
            this.navigateTo(['.']);
          } else {
            this.hideAppSpinner();
            this.logError(`Error adding item, entity: ${this.entityKey}`, response);
            this.showErrorToastr(`Error adding ${this.entityKey}`);
          }
        })
      ).subscribe());
  }

  submitEditItem({id, data}) {
    console.log('submit edit item');
    this.showAppSpinner();
    const { urlSuffix, method, params } = this.getRequestUrlAndParams('edit', 'put', data);
    this.regSub(this.apiService[method](`${this.getUrlPrefix()}/${id}${urlSuffix}`, params)
      .pipe(
        tap((response: ServerResponse) => {
          if (response.isSuccess) {
            if (this.config.isReturnItemsPageOnItemRequest) {
              this.hideAppSpinner();
              this.entityStore.items$.next(response.data.items);
              this.entityStore.totalCount$.next(response.data.totalCount);
            } else {
              this.entityStore.items$.next(null);
              if (!this.config.isRefreshTotalCountOnEdit) this.isRefreshTotalCount = false;
            }
            this.navigateTo(['.']);
          } else {
            this.hideAppSpinner();
            this.logError(`Error saving item ${id}, entity: ${this.entityKey}`, response);
            this.showErrorToastr(`Error saving ${this.entityKey}`);
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
              this.entityStore.items$.next(response.data.items);
              this.entityStore.totalCount$.next(response.data.totalCount);
            } else {
              this.getItems()
            }
          } else {
            this.hideAppSpinner();
            this.logError(`Error deleting item ${id}, entity: ${this.entityKey}`, response);
            this.showErrorToastr(`Error deleting ${this.entityKey}`);
          }
        })
      ).subscribe());
  }

  getRequestUrlAndParams(type: string, method, data?): { method: string, urlSuffix: string, params: any } {
    if (this.config.isReturnItemsPageOnItemRequest) {
      return {
        method: 'post',
        urlSuffix: `/${type}-page`,
        params: {
          doc: data,
          getItemsRequest: { ...this.entityStore.getItemsPageSettings(), isTotalCount: true }
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
    return `v1/${this.entityKey}`;
  }

}
