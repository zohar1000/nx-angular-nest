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
import { AppText } from '@sample-app/shared/consts/app-texts.const';
import { ZString } from 'zshared';

@Directive()
export abstract class BaseEntityContainerComponent extends BaseComponent implements OnInit {
  readonly DEFAULT_CONFIG = {
    isLoadItemsOnInit: true,
    isRefreshTotalCountOnEdit: false,
    isReturnItemsPageOnItemRequest: true
  };
  getItems$ = new ReplaySubject<GetItemsRequest>(1);
  config;
  PageType = PageType;
  pageType = '';
  isRefreshTotalCount = true;
  isLoading$ = new BehaviorSubject<boolean>(false);
  listPageMetrics: ListPageMetrics
  listPageCount = 0;
  isFirstListPage = true;

  constructor(public entityKey: string,
              public entityStore: BaseEntityStore,
              public numberTypeColumns: string[] = [],
              protected activatedRoute: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.initConfig();
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
        this.isFirstListPage = (this.listPageCount++ === 0);
        break;
      case PageType.EditItem:
        this.entityStore.currItem$.next(null);
        this.regSub(this.getItem(data.state.params.id).subscribe());
        break;
    }
  }

  onChangePaging(listPageMetrics: ListPageMetrics) {
    this.listPageMetrics = listPageMetrics;
    this.getItems();
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

  getItems() {
    const request: GetItemsRequest = { ...this.listPageMetrics, isTotalCount: this.isRefreshTotalCount };
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
          // this.entityStore.updatePageSettingSubject(getItems.options.isUpdateLocalStorage);
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
              this.nextPage(response.data.items, response.data.totalCount);
            } else {
              this.entityStore.items$.next(null);
            }
            this.showSuccessToastr(ZString.replaceParams(AppText.success.itemWasAdded, this.entityKey));
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
              this.nextPage(response.data.items, response.data.totalCount);
              this.hideAppSpinner();
            } else {
              this.entityStore.items$.next(null);
              if (!this.config.isRefreshTotalCountOnEdit) this.isRefreshTotalCount = false;
            }
            this.showSuccessToastr(ZString.replaceParams(AppText.success.itemWasUpdated, this.entityKey, id));
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
              this.nextPage(response.data.items, response.data.totalCount);
            } else {
              this.getItems()
            }
            this.showSuccessToastr(ZString.replaceParams(AppText.success.itemWasDeleted, this.entityKey, id));
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
          getItemsRequest: { ...this.listPageMetrics, isTotalCount: true }
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
    return `v1/${this.entityKey}`;
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
