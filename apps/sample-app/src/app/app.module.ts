import { BrowserModule } from '@angular/platform-browser';
import { Injector, NgModule } from '@angular/core';
import { NgxUiLoaderConfig, NgxUiLoaderModule } from 'ngx-ui-loader';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { setAppInjector } from '../../../api/src/app.injector';
import { CoreModule } from './core/core.module';

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
  ],
  imports: [
    // angular
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    ToastrModule.forRoot({timeOut: 3000}),

    // app
    AppRoutingModule,
    CoreModule,
    SharedModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private injector: Injector) {
    setAppInjector(this.injector);
  }
}
