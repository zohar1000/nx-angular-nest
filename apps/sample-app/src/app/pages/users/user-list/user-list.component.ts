import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { BaseEntityService } from '@sample-app/shared/base-classes/base-entity.service';
import { Tokens } from '@sample-app/shared/enums/tokens.enum';
import { BaseEntityListComponent } from '@sample-app/shared/base-classes/base-entity-list.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent extends BaseEntityListComponent {
  constructor(@Inject(Tokens.EntityService) entityService) {
    super(entityService);
  }

  onClickAdd() {
    this.entityService.navigateToAddPage();
  }

  onClickEdit() {
    this.entityService.navigateToEditPage(102);
  }

  onClickDelete() {
    this.entityService.submitDeleteItem(102);
  }

  onClickGetPage(pageNum) {

  }
}
