import { BehaviorSubject, Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { PageType } from '@sample-app/shared/enums/page-type.enum';
import { ApiService } from '@sample-app/core/services/api.service';
import { ServerResponse } from '@shared/models/server-response.model';
import { BaseService } from '@sample-app/shared/base-classes/base.service';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Tokens } from '@sample-app/shared/enums/tokens.enum';
import { Paging } from '@sample-app/shared/models/paging.model';
import { SortState } from '@sample-app/shared/models/sort-state.model';
import { HttpErrorResponse } from '@angular/common/http';
import { GetPageRequest } from '@shared/models/get-page-request.model';
import { LocalStorageService } from '@sample-app/core/services/local-storage.service';
import { appInjector } from '@sample-app/app.injector';

// TODO:
// regSub to all subscribers
// implement total count
// implement onServerResponseError
// change toastr error messages to include entity

@Injectable()
export class BaseEntityService extends BaseService {
  // private localStorageService: LocalStorageService;
  public readonly PAGE_SIZE_OPTIONS = [5, 10, 20];
  readonly DEFAULT_CONFIG = {
    isLoadItemsOnInit: true,
  }
  readonly INITIAL_PAGING: Paging = {
    pageIndex: 0,
    pageSize: 0
  }
  // public localStorageTableKey;
  public items$ = new BehaviorSubject(null);
  public currItem$ = new BehaviorSubject(null);
  // public paging$ = new BehaviorSubject({ pageIndex: 0, pageSize: 0, length: 0 });
  // public filter$ = new BehaviorSubject(null);
  // public sort$ = new BehaviorSubject(null);
  public totalCount$ = new BehaviorSubject(0);
  public paging: Paging;
  public filter;
  public sort: SortState;
  protected activatedRoute: ActivatedRoute;
  protected localStorageTableKey;
  protected apiService: ApiService;
  protected localStorageService: LocalStorageService;
  protected router: Router;

  constructor(@Inject(Tokens.EntityKey) private entityKey: string) {
    super();
    this.localStorageTableKey = `table_${this.entityKey}`;
    this.router = appInjector.get(Router);
    this.apiService = appInjector.get(ApiService);
    this.localStorageService = appInjector.get(LocalStorageService);
    this.paging = Object.assign({}, this.INITIAL_PAGING);
    // this.store = appInjector.get(Store);
    // this.regSub(this.store.select(selectPaging).subscribe((state: PagingState) => {
    //   this.setPagingPageSize(state.pageSize);
    // }));
    console.log(this.constructor.name, 'con');
  }

  init(activatedRoute: ActivatedRoute) {
    this.activatedRoute = activatedRoute;
    this.items$.next(null);
    // if (this.config.isLoadItemsOnInit) {
    //
    // }
  }

  onRoute(pageType: PageType, id?) {
    console.log('onRoute:', pageType);
    switch (pageType) {
      case PageType.List:
        if (!this.items$.value) this.getItems().subscribe(() => {});
        break;
      case PageType.EditItem:
        this.currItem$.next(null);
        this.getItem(id).subscribe(data => this.currItem$.next(data));
        break;
    }
  }

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

  getPage(req: GetPageRequest) {
    // check refreshes
    // const isResetPageIndex = ObjUtils.getKey(opts, 'isResetPageIndex', false);
    const isTotalCount = true; // ObjUtils.getKey(opts, 'isRefreshLength', false);
    // if (isResetPageIndex) this.tableService.resetPageIndex();

    // const data: any = { paging: this.paging, filter: this.filter, sort: this.sort, isTotalCount: isTotalCount };
    this.showAppSpinner();
    this.regSub(this.apiService.post(`${this.getUrlPrefix()}/page`, req)  // this.getPageItems(data)
      .pipe(
        finalize(() => this.onFetchPageComplete()),
        tap((response: ServerResponse) => {
          this.paging.pageIndex = req.paging.pageIndex;
          this.items$.next(response.data.items);
          if (isTotalCount) this.totalCount$.next(response.data.totalCount);
        })
      )
      .subscribe(
        () => {},
        (err: HttpErrorResponse) => {
          console.log('HttpErrorResponse:', err);
          // if (err.status !== 401) this.onServerResponseError(err);
        }
      )
    );
  }

  onFetchPageComplete() {
    this.hideAppSpinner();
    // this.cdr.markForCheck();
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
            this.navigateTo('.');
          } else {
            this.hideAppSpinner();
            this.logError(`Error adding item, entity: ${this.entityKey}, message: ${response.error.message}`);
            this.showErrorToastr('Error adding item');
          }
        })
      ).subscribe(() => {});
  }

  submitEditItem(id, data) {
    console.log('submit edit item');
    this.showAppSpinner();
    this.apiService.put(`${this.getUrlPrefix()}/${id}`, data)
      .pipe(
        tap((response: ServerResponse) => {
          if (response.isSuccess) {
            this.items$.next(null);
            this.navigateTo('.');
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
          if (!response.isSuccess) {
            this.logError(`Error deleting item ${id}, entity: ${this.entityKey}, message: ${response.error.message}`);
            this.showErrorToastr('Error deleting item');
          }
        }),
        switchMap(() => this.getItems())
      )
      .subscribe(() => {});
  }

  /*****************************/
  /*      N A V I G A T E      */
  /*****************************/

  navigateToAddPage() {
    this.currItem$.next(null);
    this.navigateTo(['add']);
  }

  navigateToEditPage(id) {
    this.currItem$.next(null);
    this.navigateTo(['edit', id]);
  }

  onCancelItem() {
    this.navigateTo(['.']);
  }
  navigateTo(segments: string[] | string) {
    if (!Array.isArray(segments)) segments = [segments];
    this.router.navigate(segments, { relativeTo: this.activatedRoute });
  }



  /************************/
  /*     I T E M S        */
  /************************/
/*

  getById(id) {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  add(item) {
    return this.http.post(`${this.apiUrl}`, item);
  }

  update(id, item) {
    return this.http.put(`${this.apiUrl}/${id}`, item);
  }

  delete(id) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getPageItems(data): Observable<any> {
    return this.http.post(`${this.apiUrl}/page`, data);
  }

  setTotalCount(totalCount) {
    const paging = this.paging$.value;
    paging.length = totalCount;
    this.paging$.next(paging);
  }

  fetchFilterLineData() {
    return this.http.get(`${this.apiUrl}/filter-line-data`);
  }

  getDataServiceErrorMessage(dsError: DataServiceError) {
    const errorResp: HttpErrorResponse = dsError.error;
    const error = errorResp.error.error;
    return error.message;
  }
*/
  /************************/
  /*     P A G I N G      */
  /************************/

/*  resetPageIndex() {
    const paging = this.paging$.value;
    paging.pageIndex = 0;
    this.paging$.next(paging);
  }

  setPagingPageSize(pageSize) {
    const paging = this.paging$.value;
    paging.pageSize = pageSize;
    this.paging$.next(paging);
  }

  setPaging(pageIndex, pageSize) {
    const paging = this.paging$.value;
    if (paging.pageIndex !== pageIndex) {
      paging.pageIndex = pageIndex;
      this.paging$.next(paging);
    }
    if (paging.pageSize !== pageSize) {
      this.localStorageService.setJsonItem(LocalStorageService.PAGING_KEY, { pageSize });
      this.store.dispatch(PageSize({ pageSize }));
    }
  }*/

  /************************/
  /*     F I L T E R      */
  /************************/

/*  setFilter(filter) {
    this.filter$.next(filter);
  }

  /!************************!/
  /!*      S O R T         *!/
  /!************************!/

  initSort(defaultKey) {
    const item = this.localStorageService.getJsonItem(this.localStorageTableKey);
    const sort = item && item.sort ? item.sort : { key: defaultKey, direction: 'asc' };
    this.sort$.next(sort);
  }

  setSort(sort) {
    const item = this.localStorageService.getJsonItem(this.localStorageTableKey) || {};
    item.sort = sort;
    item.order = SortDirToOrder[sort.direction];
    this.localStorageService.setJsonItem(this.localStorageTableKey, item);
    this.sort$.next((item.sort));
  }

  getLocalStorageKey() {
    return this.localStorageTableKey;
  }*/

  /***********************************************/
  /*      C O M I N G   F R O M   I T E M        */
  /***********************************************/

/*  resetComingFromItem() {
    this.isComingFromItem = false;
    this.isRefreshLength = false;
  }*/

  getUrlPrefix() {
    return `v1/${this.entityKey}`;
  }
}
