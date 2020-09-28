import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BaseEntityListComponent } from '@sample-app/shared/base-classes/base-entity-list.component';
import { BaseTableDataSource } from '@sample-app/shared/base-classes/base-table.data-source';
import { Role } from '@shared/enums/role.enum';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent extends BaseEntityListComponent {}
