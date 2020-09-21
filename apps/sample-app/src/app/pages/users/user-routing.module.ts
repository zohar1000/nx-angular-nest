import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserContainerComponent } from './user-container/user-container.component';
import { PageType } from '../../shared/enums/page-type.enum';

const routes: Routes = [
  { path: '', component: UserContainerComponent, children: [
      { path: '', data: { pageType: PageType.List }},
      { path: 'add', data: { pageType: PageType.AddItem }},
      { path: 'edit/:id', data: { pageType: PageType.EditItem }}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
