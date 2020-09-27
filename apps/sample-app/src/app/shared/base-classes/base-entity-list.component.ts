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
  @Input() totalCount$: BehaviorSubject<number>;
  @Input() isLoading$: BehaviorSubject<boolean>;
  @Input() isFirstTime: BehaviorSubject<boolean>;
  @Output() navigateToAddPage = new EventEmitter();
  @Output() navigateToEditPage = new EventEmitter();
  @Output() submitDeleteItem = new EventEmitter();
  @Output() getItems = new EventEmitter();
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) tablePaginator: MatPaginator;
  @ViewChild(MatSort) tableSort: MatSort;
  items;
  dataSource: BaseTableDataSource;
  paging: PagingSettings;
  filter;
  sort: SortSettings;
  localStorageTableKey;
  localStorageService: LocalStorageService;

  constructor(@Inject(Tokens.EntityTableColumns) public tableColumns: string[]) {
    super();
  }

  ngOnInit() {
    this.localStorageTableKey = `table_${this.entityKey}`;
    this.localStorageService = appInjector.get(LocalStorageService);
    this.initItemsPageSettingsFromLocalStorage();
    this.dataSource = new BaseTableDataSource(this.items$);
    this.getItems.emit(this.getItemsPageSettings());
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

  onChangeSort(sort: Sort) {
    this.sort = { key: sort.active, order: sort.direction === 'asc' ? 1 : -1 }
    this.storeSortSettingsInLocalStorage();
    this.getItems.emit(this.getItemsPageSettings());
  }

  onChangePaging(e: PageEvent) {
    if (e.previousPageIndex !== e.pageIndex) {
      this.paging = { ...this.paging, pageIndex: e.pageIndex };
      this.storeSortSettingsInLocalStorage();
    } else if (e.pageSize !== this.paging.pageSize) {
      this.paging = { ...this.paging, pageSize: e.pageSize };
      this.storePageSizeInLocalStorage();
    }
    this.getItems.emit(this.getItemsPageSettings());
  }

  onChangeFilterLine(filter) {
    this.filter = filter;
    this.getItems.emit(this.getItemsPageSettings());
  }

  /***************************************/
  /*      P A G E   S E T T I N G S      */
  /***************************************/

  getItemsPageSettings(): ItemsPageSettings {
    return { paging: this.paging, filter: this.filter, sort: this.sort };
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
    if (!this.isFirstTime && item.paging) this.paging.pageIndex = item.paging.pageIndex;
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
    item.paging = { pageIndex: this.paging.pageIndex };
    this.localStorageService.setJsonItem(this.localStorageTableKey, item);
  }

  updateLocalStorage() {
    this.storePageSizeInLocalStorage();
    this.storeSortSettingsInLocalStorage();
  }
}
