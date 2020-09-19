import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { PageType } from '@sample-app/shared/enums/page-type.enum';
import { ApiService } from '@sample-app/core/services/api.service';
import { EntityKeyToken } from '@sample-app/shared/consts/entity-key-token.const';
import { ServerResponse } from '@shared/models/server-response.model';
import { BaseService } from '@sample-app/shared/base-classes/base.service';
import { finalize, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class BaseEntityService extends BaseService {
  // private localStorageService: LocalStorageService;
  // public readonly PAGE_SIZE_OPTIONS = [5, 10, 20];
  // public localStorageTableKey;
  public items$ = new BehaviorSubject(null);
  public currItem$ = new BehaviorSubject(null);
  public paging$ = new BehaviorSubject({ pageIndex: 0, pageSize: 0, length: 0 });
  public filter$ = new BehaviorSubject(null);
  public sort$ = new BehaviorSubject(null);
  activatedRoute: ActivatedRoute;

  config = {
    isLoadItemsOnInit: true,
  }

  constructor(@Inject(EntityKeyToken) private entityKey: string,
              private router: Router,
              private apiService: ApiService) {
    super();
    // super(entityKey);
    // this.localStorageTableKey = `table_${this.entityKey}`;
    // this.localStorageService = appInjector.get(LocalStorageService);
    // this.store = appInjector.get(Store);
    // this.regSub(this.store.select(selectPaging).subscribe((state: PagingState) => {
    //   this.setPagingPageSize(state.pageSize);
    // }));
    console.log(this.constructor.name, 'con');
  }

  init(activatedRoute: ActivatedRoute) {
    this.activatedRoute = activatedRoute;
    this.items$.next(null);
    if (this.config.isLoadItemsOnInit) {

    }
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

  onAddItem() {
    console.log('onAddItem');
    this.currItem$.next(null);
    this.navigateTo(['add']);
  }

  onSelectItem(id) {
    console.log('onSelectItem', id);
    this.currItem$.next(null);
    this.navigateTo(['edit', id]);
  }

  onCancelItem() {
    this.navigateTo(['.']);
  }

  onSubmitAddItem(data) {
    this.submitAddItem(data).subscribe(() => {
      this.items$.next(null);
      this.navigateTo('.');
    })
  }

  onSubmitEditItem(id, data) {
    this.submitEditItem(id, data).subscribe(() => {
      this.items$.next(null);
      this.navigateTo('.');
    })
  }

  navigateTo(segments: string[] | string) {
    if (!Array.isArray(segments)) segments = [segments];
    this.router.navigate(segments, { relativeTo: this.activatedRoute });
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

  submitAddItem(data) {
    console.log('submit add item');
    this.showAppSpinner();
    return this.apiService.post(`${this.getUrlPrefix()}`, data).pipe(
      finalize(() => this.hideAppSpinner()),
      tap((response: ServerResponse) => {
        if (response.isSuccess) {
          // this.currItem$.next(response.data);
        } else {
          this.logError(`Error adding item, entity: ${this.entityKey}, message: ${response.error.message}`);
          this.showErrorToastr('Error adding item');
        }
      }));
  }

  submitEditItem(id, data) {
    console.log('submit edit item');
    this.showAppSpinner();
    return this.apiService.put(`${this.getUrlPrefix()}/${id}`, data).pipe(
      finalize(() => this.hideAppSpinner()),
      tap((response: ServerResponse) => {
        if (response.isSuccess) {
          // this.currItem$.next(response.data);
        } else {
          this.logError(`Error saving item ${id}, entity: ${this.entityKey}, message: ${response.error.message}`);
          this.showErrorToastr('Error saving item');
        }
      }));
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
