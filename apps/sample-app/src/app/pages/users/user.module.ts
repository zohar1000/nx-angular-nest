import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserContainerComponent } from './user-container/user-container.component';
import { BaseEntityStore } from '../../shared/base-classes/base-entity.store';
import { UserListComponent } from './user-list/user-list.component';
import { SharedModule } from '../../shared/shared.module';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { Tokens } from '../../shared/enums/tokens.enum';
import { UserFilterLineComponent } from './user-filter-line/user-filter-line.component';

@NgModule({
  declarations: [
    UserContainerComponent,
    UserListComponent,
    AddUserComponent,
    EditUserComponent,
    UserFilterLineComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    UserRoutingModule
  ],
  providers: [
    { provide: Tokens.EntityStore, useClass: BaseEntityStore }
  ]
})
export class UserModule { }
