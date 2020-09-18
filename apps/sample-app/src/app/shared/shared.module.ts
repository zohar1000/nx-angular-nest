import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialDesignModule } from './material-design.module';
import { NgRouterOutletCommModule } from 'ng-router-outlet-comm';
import { ngxLoadingAnimationTypes, NgxLoadingModule } from 'ngx-loading';

const modules = [
  // angular
  CommonModule,
  FormsModule,
  ReactiveFormsModule,

  // app
  MaterialDesignModule,
  NgRouterOutletCommModule
]

const spinnerOptions = {
  animationType: ngxLoadingAnimationTypes.circle,
  backdropBackgroundColour: 'rgba(0,0,0,0.3)',
  primaryColour: '#ffffff',
  secondaryColour: '#ccc'
}

@NgModule({
  declarations: [],
  imports: [...modules, NgxLoadingModule.forRoot(spinnerOptions)],
  exports: [...modules, NgxLoadingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
