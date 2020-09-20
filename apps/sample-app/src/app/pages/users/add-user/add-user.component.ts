import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { BaseEntityService } from '@sample-app/shared/base-classes/base-entity.service';
import { Tokens } from '@sample-app/shared/enums/tokens.enum';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddUserComponent {
  constructor(@Inject(Tokens.EntityService) public entityService: BaseEntityService) {
    console.log(`${this.constructor.name} con`);
  }

  onClickCancel() {
    this.entityService.onCancelItem();
  }

  onClickSubmit() {
    this.entityService.submitAddItem({ id: 103});
  }
}
