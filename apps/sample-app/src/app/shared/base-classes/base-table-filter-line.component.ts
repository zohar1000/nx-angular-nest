import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { BaseComponent } from './base.component';

// import { BaseTableService } from './base-table.service';

@Directive()
export abstract class BaseTableFilterLineComponent extends BaseComponent {
  static oneDayInMs = 86400000;  // 1 day - 24*60*60*1000
  @Input('initialFilter')
  set initialFilter(filter) {
    if (!this.filter) this.filter = filter;
  }
  @Input() numberTypeColumns;
  @Output() onChangeFilterLine = new EventEmitter<any>();
  protected dateKeys = this.getDateKeys();
  filter;
  data;

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

  getDateKeys() {
    return { startDate: 0, endDate: BaseTableFilterLineComponent.oneDayInMs };
  }

  getFilterLineToEmit() {
    const filter = { ...this.filter };
    this.numberTypeColumns.forEach(key => {
      if (filter[key]) filter[key] = Number(filter[key]);
    });
    for (const key in this.dateKeys) {
      if (filter[key]) filter[key] = new Date(filter[key].getTime() + this.dateKeys[key] - filter[key].getTimezoneOffset() * 60000);
    }
    return filter;
  }
}
