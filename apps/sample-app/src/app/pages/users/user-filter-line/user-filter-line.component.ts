import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { BaseTableFilterLineComponent } from '@sample-app/shared/base-classes/base-table-filter-line.component';
import { RoleLabelsFilter } from '@shared/consts/role.const';
import { UserStatusFilter } from '@sample-app/shared/consts/user-status.const';

@Component({
  selector: 'app-user-filter-line',
  templateUrl: './user-filter-line.component.html',
  styleUrls: ['./user-filter-line.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFilterLineComponent extends BaseTableFilterLineComponent implements OnInit {
  ngOnInit() {
    this.data = { roles: RoleLabelsFilter, statuses: UserStatusFilter };
  }
}
