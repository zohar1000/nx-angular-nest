import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // angular
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,

    // app
    AppRoutingModule,
    SharedModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
