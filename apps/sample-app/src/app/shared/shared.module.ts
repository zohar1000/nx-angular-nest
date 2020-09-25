import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialDesignModule } from './material-design.module';
import { NgRouterOutletCommModule } from 'ng-router-outlet-comm';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';
import { NgRouteChangeModule } from 'ng-route-change';
import { UserStatusLabelPipe } from '@sample-app/shared/pipes/user-status-label.pipe';
import { RoleLabelPipe } from '@sample-app/shared/pipes/role-label.pipe';

const declarations = [
  // pipes
  UserStatusLabelPipe,
  RoleLabelPipe
]

const modules = [
  // angular
  CommonModule,
  FormsModule,
  ReactiveFormsModule,

  // app
  MaterialDesignModule,
  NgRouteChangeModule,
  NgRouterOutletCommModule
]

const spinnerOptions = {
  animationType: ngxLoadingAnimationTypes.circle,
  backdropBackgroundColour: 'rgba(0,0,0,0.3)',
  primaryColour: '#ffffff',
  secondaryColour: '#ccc'
}

@NgModule({
  declarations,
  imports: [...modules, NgxLoadingModule.forRoot(spinnerOptions)],
  exports: [...modules, NgxLoadingModule, ...declarations],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
