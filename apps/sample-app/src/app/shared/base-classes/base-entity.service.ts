import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { SortDirToOrder } from '../enums/sort.enum';
import { Injectable } from '@angular/core';

@Injectable()
export class BaseEntityService {
  // private localStorageService: LocalStorageService;
  // public readonly PAGE_SIZE_OPTIONS = [5, 10, 20];
  // public localStorageTableKey;
  public items$ = new ReplaySubject(1);
  public currItem$ = new ReplaySubject(1);
  public paging$ = new BehaviorSubject({ pageIndex: 0, pageSize: 0, length: 0 });
  public filter$ = new BehaviorSubject(null);
  public sort$ = new BehaviorSubject(null);

  constructor() {
    // super(entityKey);
    // this.localStorageTableKey = `table_${this.entityKey}`;
    // this.localStorageService = appInjector.get(LocalStorageService);
    // this.store = appInjector.get(Store);
    // this.regSub(this.store.select(selectPaging).subscribe((state: PagingState) => {
    //   this.setPagingPageSize(state.pageSize);
    // }));
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
}
