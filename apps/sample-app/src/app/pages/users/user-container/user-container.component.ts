import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { BaseEntityContainerComponent } from '../../../shared/base-classes/base-entity-container.component';
import { ActivatedRoute } from '@angular/router';
import { Tokens } from '@sample-app/shared/enums/tokens.enum';

@Component({
  selector: 'app-user-container',
  templateUrl: './user-container.component.html',
  styleUrls: ['./user-container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserContainerComponent extends BaseEntityContainerComponent {
  constructor(@Inject(Tokens.EntityService) entityService, activatedRoute: ActivatedRoute) {
    super(entityService, activatedRoute);
  }
}
