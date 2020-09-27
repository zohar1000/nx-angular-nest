import { AfterViewInit, Directive, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BaseComponent } from './base.component';
import { BaseTableDataSource } from '@sample-app/shared/base-classes/base-table.data-source';
import { MatTable } from '@angular/material/table';
import { Tokens } from '@sample-app/shared/enums/tokens.enum';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { BehaviorSubject } from 'rxjs';
import { ItemsPageSettings } from '@shared/models/items-page-settings.model';
import { LocalStorageService } from '@sample-app/core/services/local-storage.service';
import { PagingSettings } from '@sample-app/shared/models/paging-settings.model';
import { SortSettings } from '@sample-app/shared/models/sort-settings.model';
import { appInjector } from '@sample-app/app.injector';

@Directive()
export abstract class BaseEntityListComponent extends BaseComponent implements OnInit, AfterViewInit {
  readonly PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100, 250];
  readonly INITIAL_PAGING: PagingSettings = { pageIndex: 0, pageSize: 10 };
  readonly INITIAL_SORT: SortSettings = { key: 'id', order: 1 };
  @Input() entityKey: string;
  @Input() items$;
//   set setItems$(items) {
// console.log('set items:', items);
//     this.items = items;
//   }
//   get getItems$() {
//     return this.items;
//   }
  @Input() totalCount$: BehaviorSubject<number>;
  // @Input() pageSettings$: BehaviorSubject<ItemsPageSettings>;
  @Input() isLoading$: BehaviorSubject<boolean>;
  @Output() navigateToAddPage = new EventEmitter();
  @Output() navigateToEditPage = new EventEmitter();
  @Output() submitDeleteItem = new EventEmitter();
  @Output() onChangePageIndex = new EventEmitter();
  @Output() onChangePageSize = new EventEmitter();
  @Output() onChangeSort = new EventEmitter();
  @Output() getItems = new EventEmitter();
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) tablePaginator: MatPaginator;
  @ViewChild(MatSort) tableSort: MatSort;
  items;
  pageSettings$: BehaviorSubject<ItemsPageSettings>;
  dataSource: BaseTableDataSource;
  paging: PagingSettings;
  filter;
  sort: SortSettings;
  localStorageTableKey;
  localStorageService: LocalStorageService;
  // updateLocalStorageTrigger;
  isUpdateLocalStorage = false;

  constructor(@Inject(Tokens.EntityTableColumns) public tableColumns: string[]) {
    super();
  }

  ngOnInit() {
    this.localStorageTableKey = `table_${this.entityKey}`;
    this.localStorageService = appInjector.get(LocalStorageService);
    this.initItemsPageSettingsFromLocalStorage();
    this.pageSettings$ = new BehaviorSubject<ItemsPageSettings>(this.getItemsPageSettings());
    this.dataSource = new BaseTableDataSource(this.items$);
    this.getItems.emit(this.getItemsPageSettings());
    this.items$.subscribe(items => {
      console.log('trigger:', items);
      if (items !== null && this.isUpdateLocalStorage) this.updateLocalStorage();
      this.isUpdateLocalStorage = false;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.tablePaginator;
  }

  onClickAdd() {
    this.navigateToAddPage.emit();
  }

  onClickEdit(id) {
    this.navigateToEditPage.emit(id);
  }

  onClickDelete(id) {
    this.submitDeleteItem.emit(id);
  }

  onClickSort(sort: Sort) {
    // const order = sort.direction === 'asc' ? 1 : -1;
    // this.onChangeSort.emit({ key: sort.active, order });
    this.sort.key = sort.active;
    this.sort.order = sort.direction === 'asc' ? 1 : -1;
    // this.storeSortSettingsInLocalStorage();
    this.isUpdateLocalStorage = true;
    this.getItems.emit(this.getItemsPageSettings());
  }

  onChangePaging(e: PageEvent) {
    console.log('onChangePaging:', e);
    if (e.previousPageIndex !== e.pageIndex) {
      // this.onChangePageIndex.emit(e.pageIndex);
      this.paging.pageIndex = e.pageIndex;
    } else if (e.pageSize !== this.pageSettings$.value.paging.pageSize) {
      // this.onChangePageSize.emit(e.pageSize);
      this.paging.pageSize = e.pageSize;
      this.isUpdateLocalStorage = true;
      // this.storePageSizeInLocalStorage();
    }
    this.getItems.emit(this.getItemsPageSettings());
  }

  onChangeFilterLine(filter) {
    console.log('onChangeFilterLine:', filter);
    // this.tableService.setFilter(filter);
    // this.fetchPage({ isResetPageIndex: true, isRefreshLength: true });
  }

  /***************************************/
  /*      P A G E   S E T T I N G S      */
  /***************************************/

  // onChangePageIndex(pageIndex) {
  //   this.paging.pageIndex = pageIndex;
  // }

  // onChangePageSize(pageSize) {
  //   this.paging.pageSize = pageSize;
  // }

  // onChangeSort(key, order) {
  //   this.sort.key = key;
  //   this.sort.order = order;
  // }

  getItemsPageSettings(): ItemsPageSettings {
    return { paging: this.paging, filter: this.filter, sort: this.sort };
  }

  updatePageSettingSubject(isUpdateLocalStorage: boolean) {
    if (isUpdateLocalStorage) this.updateLocalStorage();
    this.pageSettings$.next(this.getItemsPageSettings());
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
    this.filter = this.getInitialFilter();
  }

  getInitialFilter() {
    return {};
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
