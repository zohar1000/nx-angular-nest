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
import { Paging } from '@sample-app/shared/models/paging.model';
import { SortState } from '@sample-app/shared/models/sort-state.model';
import { LocalStorageService } from '@sample-app/core/services/local-storage.service';
import { appInjector } from '@sample-app/app.injector';

// TODO:
// regSub to all subscribers
// implement total count
// implement onServerResponseError
// change toastr error messages to include entity
// save in local storage: sort key, sort direction

@Directive()
export abstract class BaseEntityContainerComponent extends BaseComponent implements OnInit {
  readonly INITIAL_PAGING: Paging = { pageIndex: 0, pageSize: 10 }
  readonly INITIAL_SORT: SortState = { key: 'id', order: 1 }
  pageType = '';
  PageType = PageType;
  items$ = new BehaviorSubject(null);
  currItem$ = new BehaviorSubject(null);
  public totalCount$ = new BehaviorSubject(0);
  public paging: Paging = {...this.INITIAL_PAGING}
  public filter = {};
  public sort: SortState = {...this.INITIAL_SORT};
  paging$ = new ReplaySubject(1);
  protected localStorageTableKey;
  protected localStorageService: LocalStorageService;

  constructor(protected entityKey: string,
              protected entityService: BaseEntityService,
              private activatedRoute: ActivatedRoute) {
    super();
    console.log(`${this.constructor.name} con`);
  }

  ngOnInit(): void {
    this.localStorageService = appInjector.get(LocalStorageService);
    this.entityService.init(this.activatedRoute);
    this.localStorageTableKey = `table_${this.entityKey}`;
    this.paging$.pipe(switchMap(paging => this.fetchFromServer(paging))).subscribe(
      () => {},
      (err: HttpErrorResponse) => {
        console.log('HttpErrorResponse:', err);
        // if (err.status !== 401) this.onServerResponseError(err);
      }
    );
  }

  onRouteChange(data: RouteChangeData) {
    const pageType = data.state.data ? data.state.data.pageType : '';
console.log('onRouteChange, pageType:', pageType);
    if (!pageType) return;
    this.pageType = pageType;
    // if (pageType) this.entityService.onRoute(pageType, data.state.params.id);

    switch (pageType) {
      case PageType.List:
        // if (!this.items$.value) this.getPage();
        if (!this.items$.value) this.getPageByNewPaging();
        break;
      case PageType.EditItem:
        this.currItem$.next(null);
        this.getItem(data.state.params.id).subscribe(response => this.currItem$.next(response));
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
          this.logError(`Error getting item ${id}, entity: ${this.entityKey}, message: ${response.error.message}`);
          this.showErrorToastr('Error getting item');
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
          this.showErrorToastr('Error getting items');
        }
      }));
  }

  getPageByPageIndex(pageIndex) {
    this.paging.pageIndex = pageIndex;
    this.getPageByNewPaging();
  }

  getPageBySort({key, order}) {
    this.sort.key = key;
    this.sort.order = order;
    this.getPageByNewPaging();
  }

  getPageByNewPaging() {
    const paging = { paging: this.paging, filter: this.filter, sort: this.sort, isTotalCount: true }
    this.paging$.next(paging);
  }

  fetchFromServer(paging) {
console.log('fetchFromServer, paging:', JSON.stringify(paging));
    this.showAppSpinner();
    return this.apiService.post(`${this.getUrlPrefix()}/page`, paging).pipe(
      finalize(() => this.hideAppSpinner()),
      tap((response: ServerResponse) => {
        this.paging.pageIndex = paging.paging.pageIndex;  // save for next pages
        this.items$.next(response.data.items);
        if (paging.isTotalCount) this.totalCount$.next(response.data.totalCount);
      })
    )
  }


  /*********************************************************/
  /*      S U B M I T   A D D / E D I T / D E L E T E      */
  /*********************************************************/

  submitAddItem(data) {
    console.log('submit add item');
    this.showAppSpinner();
    this.apiService.post(`${this.getUrlPrefix()}`, data)
      .pipe(
        tap((response: ServerResponse) => {
          if (response.isSuccess) {
            this.items$.next(null);
            this.navigateTo(['.']);
          } else {
            this.hideAppSpinner();
            this.logError(`Error adding item, entity: ${this.entityKey}, message: ${response.error.message}`);
            this.showErrorToastr('Error adding item');
          }
        })
      ).subscribe(() => {});
  }

  submitEditItem({id, data}) {
    console.log('submit edit item');
    this.showAppSpinner();
    this.apiService.put(`${this.getUrlPrefix()}/${id}`, data)
      .pipe(
        tap((response: ServerResponse) => {
          if (response.isSuccess) {
            this.items$.next(null);
            this.navigateTo(['.']);
          } else {
            this.hideAppSpinner();
            this.logError(`Error saving item ${id}, entity: ${this.entityKey}, message: ${response.error.message}`);
            this.showErrorToastr('Error saving item');
          }
        })
      ).subscribe(() => {});
  }

  submitDeleteItem(id) {
    this.showAppSpinner();
    this.apiService.delete(`${this.getUrlPrefix()}/${id}`)
      .pipe(
        tap((response: ServerResponse) => {
          if (response.isSuccess) {
            this.getPageByNewPaging()
          } else {
            this.logError(`Error deleting item ${id}, entity: ${this.entityKey}, message: ${response.error.message}`);
            this.showErrorToastr('Error deleting item');
          }
        })
      )
      .subscribe(() => {});
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
console.log('onCancelItem !!!!');
    this.navigateTo(['.']);
  }

  navigateTo(segments: string[]) {
    this.router.navigate(segments, { relativeTo: this.activatedRoute });
  }



  getUrlPrefix() {
    return `v1/${this.entityKey}`;
  }

}
