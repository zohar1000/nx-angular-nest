import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseEntityListComponent } from '@sample-app/shared/base-classes/base-entity-list.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent extends BaseEntityListComponent {}
