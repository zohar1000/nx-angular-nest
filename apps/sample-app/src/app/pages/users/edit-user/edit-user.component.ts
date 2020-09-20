import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { BaseEntityService } from '@sample-app/shared/base-classes/base-entity.service';
import { Tokens } from '@sample-app/shared/enums/tokens.enum';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditUserComponent {
  constructor(@Inject(Tokens.EntityService) public entityService: BaseEntityService) {
    console.log(`${this.constructor.name} con, currItem$:`, this.entityService.currItem$.value);
  }

  onClickCancel() {
    this.entityService.onCancelItem();
  }

  onClickSubmit() {
    this.entityService.submitEditItem(102, { id: 102});
  }
}
