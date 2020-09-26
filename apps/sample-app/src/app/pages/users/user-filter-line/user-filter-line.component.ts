import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BaseTableFilterLineComponent } from '@sample-app/shared/base-classes/base-table-filter-line.component';
import { RolesLabelsFilter } from '@shared/consts/role.const';
import { UserStatusFilter } from '@sample-app/shared/consts/user-status.const';

@Component({
  selector: 'app-user-filter-line',
  templateUrl: './user-filter-line.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFilterLineComponent extends BaseTableFilterLineComponent implements OnInit {
  // constructor(userService: UserService, cdr: ChangeDetectorRef) {
    // super(userService, cdr);
  constructor(cdr: ChangeDetectorRef) {
    super(cdr);
  }

  ngOnInit() {
    this.data = {
      roles: { '': 'All', ...RolesLabelsFilter },
      statuses: { '': 'All', ...UserStatusFilter }
    };
  }

  getNumKeys() {
    return ['status'];
  }
}
