import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { EntityServiceToken } from '@sample-app/shared/consts/entity-service-token.const';
import { BaseEntityService } from '@sample-app/shared/base-classes/base-entity.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddUserComponent {
  constructor(@Inject(EntityServiceToken) public entityService: BaseEntityService) {
    console.log(`${this.constructor.name} con`);
  }

  onClickCancel() {
    this.entityService.onCancelItem();
  }

  onClickSubmit() {
    this.entityService.onSubmitAddItem({ id: 103});
  }
}
