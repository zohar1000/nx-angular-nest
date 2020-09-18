import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { BaseEntityContainerComponent } from '../../../shared/base-classes/base-entity-container.component';

@Component({
  selector: 'app-user-container',
  templateUrl: './user-container.component.html',
  styleUrls: ['./user-container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserContainerComponent extends BaseEntityContainerComponent implements OnInit {
  config = {
    isLoadItemsOnInit: true,
  }

  constructor(@Inject('ENTITY_KEY') entityKey: string,
              @Inject('ENTITY_SERVICE') entityService) {
    super(entityKey, entityService);
  }

  ngOnInit(): void {
    if (this.config.isLoadItemsOnInit) {

    }
  }

}
