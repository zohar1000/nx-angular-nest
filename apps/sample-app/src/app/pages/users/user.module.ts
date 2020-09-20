import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserContainerComponent } from './user-container/user-container.component';
import { BaseEntityService } from '../../shared/base-classes/base-entity.service';
import { UserListComponent } from './user-list/user-list.component';
import { SharedModule } from '../../shared/shared.module';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { Tokens } from '../../shared/enums/tokens.enum';

@NgModule({
  declarations: [
    UserContainerComponent,
    UserListComponent,
    AddUserComponent,
    EditUserComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule
  ],
  providers: [
    { provide: Tokens.EntityKey, useValue: 'user'},
    { provide: Tokens.EntityService, useClass: BaseEntityService}

  ]
})
export class UserModule { }
