import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { EntityServiceToken } from '@sample-app/shared/consts/entity-service-token.const';
import { BaseEntityService } from '@sample-app/shared/base-classes/base-entity.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditUserComponent {
  constructor(@Inject(EntityServiceToken) public entityService: BaseEntityService) {
    console.log(`${this.constructor.name} con, currItem$:`, this.entityService.currItem$.value);
  }

  onClickCancel() {
    this.entityService.onCancelItem();
  }

  onClickSubmit() {
    this.entityService.onSubmitEditItem(102, { id: 102});
  }
}
