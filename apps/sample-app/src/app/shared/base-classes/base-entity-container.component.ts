import { BaseEntityStore } from './base-entity.store';
import { BaseComponent } from '@sample-app/shared/base-classes/base.component';
import { ActivatedRoute } from '@angular/router';
import { Directive, OnInit } from '@angular/core';
import { RouteChangeData } from 'ng-route-change';
import { PageType } from '@sample-app/shared/enums/page-type.enum';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { ServerResponse } from '@shared/models/server-response.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ReplaySubject } from 'rxjs';
import { GetItemsRequest } from '@shared/models/get-items-request.model';
import { GetItemsResponse } from '@shared/models/get-items-response.model';
import { ListPageSettings } from '@shared/models/list-page-settings.model';

// TODO:
// implement onServerResponseError

@Directive()
export abstract class BaseEntityContainerComponent extends BaseComponent implements OnInit {
  readonly DEFAULT_CONFIG = { isLoadItemsOnInit: true, isRefreshTotalCountOnEdit: false };
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
    const settings: ListPageSettings = this.entityStore.getListPageSettings();
    const getItemsRequest: GetItemsRequest = { ...settings, isTotalCount: isRefreshTotalCount };
    this.isRefreshTotalCount = true;
    this.getItemsRequest$.next(getItemsRequest);
  }

  sendItemsReqToServer(paging) {
    this.showAppSpinner();
    return this.apiService.post(`${this.getUrlPrefix()}/page`, paging).pipe(
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
    this.regSub(this.apiService.post(`${this.getUrlPrefix()}`, data)
      .pipe(
        tap((response: ServerResponse) => {
          if (response.isSuccess) {
            this.entityStore.items$.next(null);
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
    this.regSub(this.apiService.put(`${this.getUrlPrefix()}/${id}`, data)
      .pipe(
        tap((response: ServerResponse) => {
          if (response.isSuccess) {
            this.entityStore.items$.next(null);
            if (!this.config.isRefreshTotalCountOnEdit) this.isRefreshTotalCount = false;
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
    this.regSub(this.apiService.delete(`${this.getUrlPrefix()}/${id}`)
      .pipe(
        tap((response: ServerResponse) => {
          if (response.isSuccess) {
            this.getItems()
          } else {
            this.hideAppSpinner();
            this.logError(`Error deleting item ${id}, entity: ${this.entityKey}`, response);
            this.showErrorToastr(`Error deleting ${this.entityKey}`);
          }
        })
      ).subscribe());
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
