import { BrowserModule } from '@angular/platform-browser';
import { Injector, NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { setAppInjector } from './app.injector';
import { CoreModule } from './core/core.module';
import { LangEnComponent } from '@sample-app/translations/lang-en.component';
import { LangEsComponent } from '@sample-app/translations/lang-es.component';
import { TranslyRootModule, TranslyConfig } from 'ngx-transly';
import { setAppText } from '@sample-app/shared/consts/app-text.const';

const translyConfig: TranslyConfig = {
  langs: [
    { code: 'en', path: `./translations/lang-en.component`, name: 'English', default: true },
    { code: 'es', path: `./translations/lang-es.component`, name: 'Spanish' }
  ],
  isUseBrowserDefaultLang: true,
  loadLang: langCode => import(`./translations/lang-${langCode}.component`),
  setText: text => setAppText(text),
  localStorageKey: 'language',
  onLoadError: (langCode, config, e) => console.log('onLoadError:', langCode, config, e)
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // angular
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    ToastrModule.forRoot({ timeOut: 3000 }),

    TranslyRootModule.forRoot(translyConfig),

    // app
    AppRoutingModule,
    CoreModule,
    SharedModule,
  ],
  bootstrap: [AppComponent],
  entryComponents: [LangEnComponent, LangEsComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
    setAppInjector(this.injector);
  }
}
