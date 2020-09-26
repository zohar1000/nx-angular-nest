import { ChangeDetectorRef, Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BaseComponent } from './base.component';
// import { BaseTableService } from './base-table.service';

@Directive()
export abstract class BaseTableFilterLineComponent extends BaseComponent implements OnInit {
  static oneDayInMs = 86400000;  // 1 day - 24*60*60*1000
  @Input('defaultFilter')
  set defaultFilter(defaultFilter) {
    if (!this.filter) this.filter = defaultFilter;
  }
  @Output() onChangeFilterLine = new EventEmitter<any>();
  protected numKeys = this.getNumKeys();
  protected dateKeys = this.getDateKeys();
  filter: any; //  = this.getDefaultFilter();
  data;

  protected constructor(// protected tableService: BaseTableService<any>,
                        protected cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    // this.regSub(this.tableService.fetchFilterLineData().subscribe(data => {
    //   this.onServerData(data);
    //   this.cdr.markForCheck();
    // }));
  }

  onServerData(data) {
    this.data = data;
  }

  onChangeFilterField(key, value) {
    this.filter[key] = value;
    if (this.isFilterLineValid()) this.emit();
  }

  emit() {
    this.onChangeFilterLine.emit(this.getFilterLineToEmit());
  }

  isFilterLineValid() {
    return true;
  }

  getNumKeys() {
    return ['deviceId'];
  }

  getDateKeys() {
    return { startDate: 0, endDate: BaseTableFilterLineComponent.oneDayInMs };
  }

  getFilterLineToEmit() {
    const filter = { ...this.filter };
    this.numKeys.forEach(key => {
      if (filter[key]) filter[key] = Number(filter[key]);
    });
    for (const key in this.dateKeys) {
      if (filter[key]) filter[key] = new Date(filter[key].getTime() + this.dateKeys[key] - filter[key].getTimezoneOffset() * 60000);
    }
    return filter;
  }
}
