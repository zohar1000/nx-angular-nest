import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';


const routes: Routes = [
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule), data: { isFullPage: true }},
  { path: 'user', loadChildren: () => import('./pages/users/user.module').then(m => m.UserModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
