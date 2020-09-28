import { AfterViewInit, Directive, EventEmitter, Inject, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { BaseComponent } from './base.component';
import { BaseTableDataSource } from '@sample-app/shared/base-classes/base-table.data-source';
import { MatTable } from '@angular/material/table';
import { Tokens } from '@sample-app/shared/enums/tokens.enum';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from '@sample-app/core/services/local-storage.service';
// import { PagingMetrics } from '@sample-app/shared/models/paging-metrics.model';
// import { SortMetrics } from '@sample-app/shared/models/sort-metrics.model';
import { appInjector } from '@sample-app/app.injector';
import { LocalStorageTable } from '@shared/models/local-storage-table.mode';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { ListPageMetrics } from '@shared/models/list-page-metrics.model';
import { SortMetrics } from '@sample-app/shared/models/sort-metrics.model';

@Directive()
export abstract class BaseEntityListComponent extends BaseComponent implements OnInit, AfterViewInit {
  readonly PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100, 250];
  @Input() items$;
  @Input() totalCount$: BehaviorSubject<number>;
  @Input() listPageMetrics$: BehaviorSubject<ListPageMetrics>;
  @Input() isLoading$: BehaviorSubject<boolean>;
  @Input() numberTypeColumns: string[];
  @Input() localStorageTableKey: string;
  @Output() navigateToAddPage = new EventEmitter();
  @Output() navigateToEditPage = new EventEmitter();
  @Output() submitDeleteItem = new EventEmitter();
  @Output() onChangeListPageMetrics = new EventEmitter();
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) tablePaginator: MatPaginator;
  @ViewChild(MatSort) tableSort: MatSort;
  @ViewChild('deleteDialog') deleteDialogTemplateRef: TemplateRef<any>;
  items;
  dataSource: BaseTableDataSource;
  // pagingMetrics: PagingMetrics;
  // filter;
  // sortMetrics: SortMetrics;
  localStorageService: LocalStorageService;

  constructor(@Inject(Tokens.EntityTableColumns) public tableColumns: string[],
              public dialog: MatDialog) {
    super();
  }

  ngOnInit() {
    this.localStorageService = appInjector.get(LocalStorageService);
    // this.initListPageMetricsFromLocalStorage();
    this.dataSource = new BaseTableDataSource(this.items$);
    // this.emitPageMetrics(false);
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
    // this.submitDeleteItem.emit(id);

    const dialogRef = this.dialog.open(this.deleteDialogTemplateRef, {
      width: '30vw',
      data: { id }
    });
    this.regSub(dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result) this.submitDeleteItem.emit(id);
    }));
  }

  /*****************************************/
  /*      C H A N G E   M E T R I C S      */
  /*****************************************/

  onChangeSort(sort: Sort) {
    const sortMetrics: SortMetrics = { key: sort.active, order: sort.direction === 'asc' ? 1 : -1 };
    const metrics: ListPageMetrics = { ...this.listPageMetrics$.value, sort: sortMetrics };
    this.emitPageMetrics(metrics, true);
  }

  onChangePaging(e: PageEvent) {
    const metrics: ListPageMetrics = { ...this.listPageMetrics$.value };
    if (e.previousPageIndex !== e.pageIndex) {
      metrics.paging.pageIndex = e.pageIndex;
    } else if (e.pageSize !== metrics.paging.pageSize) {
      metrics.paging.pageSize = e.pageSize;
    }
    this.emitPageMetrics(metrics, true);
  }

  onChangeFilterLine(filter) {
    const metrics: ListPageMetrics = { ...this.listPageMetrics$.value, filter };
    this.emitPageMetrics(metrics, false);
  }

  emitPageMetrics(metrics: ListPageMetrics, isUpdateLocalStorage) {
    if (isUpdateLocalStorage) this.updateLocalStorage(metrics);
    this.onChangeListPageMetrics.emit(metrics);
  }

  /***************************************/
  /*      L O C A L   S T O R A G E      */
  /***************************************/
/*
  initListPageMetricsFromLocalStorage() {
    const item: LocalStorageTable = this.localStorageService.getJsonItem(this.localStorageTableKey);
    if (!item) {
      this.sortMetrics = { ...this.INITIAL_SORT_METRICS };
      this.pagingMetrics = { ...this.INITIAL_PAGING_METRICS };
    } else {
      this.sortMetrics = item.sortMetrics;
      if (!this.pagingMetrics) this.pagingMetrics = { ...this.INITIAL_PAGING_METRICS };
      this.pagingMetrics.pageIndex = (this.isFirstTime ? 0 : item.pageIndex);
    }
    const pageSize = this.localStorageService.getItem(LocalStorageService.PAGE_SIZE);
    this.pagingMetrics.pageSize = pageSize ? Number(pageSize) : this.DEFAULT_PAGE_SIZE;
    this.filter = this.getInitialFilter();
  }

  getInitialFilter() {
    return {};
  }
*/
  updateLocalStorage(metrics: ListPageMetrics) {
    const item: LocalStorageTable = this.localStorageService.getJsonItem(this.localStorageTableKey) || {};
    item.sortMetrics = metrics.sort;
    item.pageIndex = metrics.paging.pageIndex;
    this.localStorageService.setJsonItem(this.localStorageTableKey, item);
    this.localStorageService.setItem(LocalStorageService.PAGE_SIZE, metrics.paging.pageSize);
  }
}
