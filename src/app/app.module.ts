import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from './shared/shared.module';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { LoaderService } from './shared/loader-service';
import { TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

// #region of declaration for MSAL
// import { MsalService, MSAL_INSTANCE, MsalGuard, MsalInterceptor, MsalBroadcastService } from './msal';
// import { IPublicClientApplication, PublicClientApplication, InteractionType } from '@azure/msal-browser';
// import { MSAL_GUARD_CONFIG, MSAL_INTERCEPTOR_CONFIG } from './msal/constants';
// import { MsalGuardConfiguration } from './msal/msal.guard.config';
// import { MsalInterceptorConfig } from './msal/msal.interceptor.config';
// #endregion

//#region import for @azure/msal-angular
import { Configuration } from 'msal';
import {
  MsalModule, MsalInterceptor, MSAL_CONFIG, MSAL_CONFIG_ANGULAR,
  MsalService, MsalAngularConfiguration
} from '@azure/msal-angular';
import { msalConfig, msalAngularConfig } from './azure-config';
//#endregion

import { RoleGuard } from './shared/roles.guard';
import { AppInterceptor } from './shared/app-interceptor';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { AppPaginatorIntl } from './shared/app-paginator-intl';

// tslint:disable-next-line:typedef
export function createTranslateHttpLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/lang/', '.json');
}

function myDefaultLang(): string {
  const lang = localStorage.getItem('language');
  return lang && lang.length > 0 ? lang : 'en';
}

// function MSALInstanceFactory(): IPublicClientApplication {
//   return new PublicClientApplication({
//     auth: {
//       clientId: 'fbeb22e6-52e6-48c8-82eb-07604a68d38d',
//       redirectUri: location.origin,
//       // authority: 'https://cimcnj.b2clogin.com/cimcnj.onmicrosoft.com/B2C_1_login',
//       // postLogoutRedirectUri: `${location.origin}`,
//       // navigateToLoginRequestUrl: true,
//       // knownAuthorities: ['https://cimcnj.b2clogin.com/cimcnj.onmicrosoft.com/B2C_1_login']
//     },
//     cache: {
//       cacheLocation: 'sessionStorage',
//       storeAuthStateInCookie: false
//     }
//   });
// }

// function MSALInterceptorConfigFactory(): MsalInterceptorConfig {
//   const protectedResourceMap = new Map<string, Array<string>>();
//   protectedResourceMap.set('https://graph.microsoft.com/v1.0/me', ['user.read']);
//   // protectedResourceMap.set('https://cimcnj.onmicrosoft.com/fbeb22e6-52e6-48c8-82eb-07604a68d38d', ['STsysAirFreight.Basic']);
//   protectedResourceMap.set(`${location.origin}/api`,
// ['https://cimcnj.onmicrosoft.com/fbeb22e6-52e6-48c8-82eb-07604a68d38d/STsysAirFreight.Basic']);

//   return {
//     interactionType: InteractionType.Popup,
//     protectedResourceMap
//   };
// }

function MSALConfigFactory(): Configuration {
  return msalConfig;
}

function MSALAngularConfigFactory(): MsalAngularConfiguration {
  return msalAngularConfig;
}

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    FooterComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    SharedModule,
    HttpClientModule,
    TranslateModule.forRoot({
      defaultLanguage: myDefaultLang(),
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateHttpLoader),
        deps: [HttpClient]
      }
    }),
    MsalModule
  ],
  providers: [
    LoaderService,
    RoleGuard,
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: MsalInterceptor,
    //   multi: true
    // },
    // {
    //   provide: MSAL_INSTANCE,
    //   useFactory: MSALInstanceFactory
    // },
    // {
    //   provide: MSAL_GUARD_CONFIG,
    //   useValue: {
    //     interactionType: InteractionType.Redirect
    //   } as MsalGuardConfiguration
    // },
    // {
    //   provide: MSAL_INTERCEPTOR_CONFIG,
    //   useFactory: MSALInterceptorConfigFactory
    // },
    // MsalService,
    // MsalGuard,
    // MsalBroadcastService
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppInterceptor,
      multi: true
    },
    {
      provide: MSAL_CONFIG,
      useFactory: MSALConfigFactory
    },
    {
      provide: MSAL_CONFIG_ANGULAR,
      useFactory: MSALAngularConfigFactory
    },
    {
      provide: MatPaginatorIntl,
      useClass: AppPaginatorIntl
    },
    MsalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
