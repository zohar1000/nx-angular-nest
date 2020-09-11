import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialDesignModule } from './material-design.module';

const modules = [
  CommonModule,
  FormsModule,
  // ReactiveFormsModule,

  MaterialDesignModule
]

@NgModule({
  declarations: [],
  imports: modules,
  exports: modules
})
export class SharedModule { }
