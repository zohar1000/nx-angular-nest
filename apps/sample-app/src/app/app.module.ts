import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxUiLoaderConfig, NgxUiLoaderModule } from 'ngx-ui-loader';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './pages/login/login/login.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsColor: '#1a91eb',
  fgsSize: 30,
  fgsType: 'ball-spin-fade-rotating',
  overlayColor: 'rgba(40,40,40,0.15)',
  hasProgressBar: false,
  delay: 0,
  fastFadeOut: true
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    // angular
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),

    // app
    AppRoutingModule,
    SharedModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
