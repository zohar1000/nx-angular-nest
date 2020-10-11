import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseEntityListComponent } from '@sample-app/shared/base-classes/base-entity-list.component';
import { AppText } from '@sample-app/shared/models/app-text.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent extends BaseEntityListComponent {
  text;

  onTranslyText(data) {
    super.onTranslyText(data);
    this.text = (data.text as AppText).pages.users.list;
  }
}
