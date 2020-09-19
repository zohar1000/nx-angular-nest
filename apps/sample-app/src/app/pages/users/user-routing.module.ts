import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserContainerComponent } from './user-container/user-container.component';
import { UserListComponent } from './user-list/user-list.component';
import { PageType } from '../../shared/enums/page-type.enum';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';

const routes: Routes = [
  { path: '', component: UserContainerComponent, children: [
      { path: '', component: UserListComponent, data: { pageType: PageType.List }},
      { path: 'add', component: AddUserComponent, data: { pageType: PageType.AddItem }},
      { path: 'edit/:id', component: EditUserComponent, data: { pageType: PageType.EditItem }}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
