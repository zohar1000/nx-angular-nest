import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserContainerComponent } from './user-container/user-container.component';
import { BaseEntityService } from '../../shared/base-classes/base-entity.service';
import { UserListComponent } from './user-list/user-list.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    UserContainerComponent,
    UserListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule
  ],
  providers: [
    { provide: 'ENTITY_KEY', useValue: 'user'},
    { provide: 'ENTITY_SERVICE', useClass: BaseEntityService}
  ]
})
export class UserModule { }
