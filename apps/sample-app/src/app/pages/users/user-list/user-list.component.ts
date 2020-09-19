import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { EntityServiceToken } from '@sample-app/shared/consts/entity-service-token.const';
import { BaseEntityService } from '@sample-app/shared/base-classes/base-entity.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  constructor(@Inject(EntityServiceToken) public entityService: BaseEntityService) {}

  onClickAdd() {
    this.entityService.onAddItem();
  }

  onClickSelect() {
    this.entityService.onSelectItem(102);
  }
}
