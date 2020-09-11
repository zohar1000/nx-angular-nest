import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

const modules = [
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatSelectModule,
  MatSidenavModule,
  MatToolbarModule
]

@NgModule({
  imports: modules,
  exports: modules
})

export class MaterialDesignModule {
}

