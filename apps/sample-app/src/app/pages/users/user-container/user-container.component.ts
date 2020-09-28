import { Component, Inject } from '@angular/core';
import { BaseEntityContainerComponent } from '../../../shared/base-classes/base-entity-container.component';
import { ActivatedRoute } from '@angular/router';
import { Tokens } from '@sample-app/shared/enums/tokens.enum';
import { Entity } from '@sample-app/shared/models/entity.model';

@Component({
  selector: 'app-user-container',
  templateUrl: './user-container.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserContainerComponent extends BaseEntityContainerComponent {
  constructor(@Inject(Tokens.EntityStore) entityStore, activatedRoute: ActivatedRoute) {
    super(entityStore, activatedRoute);
  }

  getEntity(): Entity {
    return {
      key: 'user',
      label: 'User',
      tableColumns: ['id', 'firstName', 'lastName', 'status', 'email', 'role', 'lastLoginTime', 'edit', 'delete'],
      numberTypeColumns: ['status'],
      initialFilter: { role: '', status: '' }
    }
  }
}
