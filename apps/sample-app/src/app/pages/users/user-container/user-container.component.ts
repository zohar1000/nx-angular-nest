import { Component, Inject } from '@angular/core';
import { BaseEntityContainerComponent } from '../../../shared/base-classes/base-entity-container.component';
import { ActivatedRoute } from '@angular/router';
import { Tokens } from '@sample-app/shared/enums/tokens.enum';

@Component({
  selector: 'app-user-container',
  templateUrl: './user-container.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserContainerComponent extends BaseEntityContainerComponent {
  constructor(@Inject(Tokens.EntityKey) entityKey: string,
              @Inject(Tokens.EntityService) entityService,
              activatedRoute: ActivatedRoute) {
    super(entityKey, entityService, activatedRoute);
  }
}
