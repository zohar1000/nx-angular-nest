import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { BaseEntityContainerComponent } from '../../../shared/base-classes/base-entity-container.component';
import { EntityServiceToken } from '@sample-app/shared/consts/entity-service-token.const';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-container',
  templateUrl: './user-container.component.html',
  styleUrls: ['./user-container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserContainerComponent extends BaseEntityContainerComponent {
  constructor(@Inject(EntityServiceToken) entityService, activatedRoute: ActivatedRoute) {
    super(entityService, activatedRoute);
  }
}
