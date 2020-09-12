import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialDesignModule } from './material-design.module';

const modules = [
  // angular
  CommonModule,
  FormsModule,
  ReactiveFormsModule,

  // app
  MaterialDesignModule
]

@NgModule({
  declarations: [],
  imports: modules,
  exports: modules
})
export class SharedModule { }
