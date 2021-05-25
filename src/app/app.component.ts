import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { LoaderService } from './shared/loader-service';
import { ProfileService } from './shared/profile.service';

import { BroadcastService, MsalService} from '@azure/msal-angular';
import { isIE, b2cPolicies } from './azure-config';
import { CryptoUtils, Logger, LogLevel } from 'msal';
import { NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  showLoader: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isIframe = false;
  loggedIn = false;
  subscriptions: Subscription[] = [];
  isLoggedIn$ = new BehaviorSubject<boolean>(false);
  observables: Observable<any>[] = [];

  constructor(private loader: LoaderService,
              public profile: ProfileService,
              private authService: MsalService,
              private broadcastSerivce: BroadcastService,
              private router: Router
              )
              {
                profile.clear();
              }

  ngOnInit(): void {
    let loginSuccessSubscription: Subscription;
    let loginFailureSubscription: Subscription;
    let acquireTokenSuccessSubscription: Subscription;
    let acquireTokenFailureSubscription: Subscription;
    let loaderSubscription: Subscription;
    let routerSubscription: Subscription;

    this.isIframe = window !== window.parent && !window.opener;
    loaderSubscription = this.loader.status.pipe(tap((val: boolean) => this.showLoader.next(val))).subscribe();
    routerSubscription = this.router.events.pipe(tap((e) => {
      if (e instanceof NavigationStart) {
        this.loader.display(true);
        if (!this.profile.identity && this.profile.isLoggedIn) {
          this.profile.loadProfile();
        }
      }
    })).subscribe();

    loginSuccessSubscription = this.broadcastSerivce.subscribe('msal:loginSuccess', (success) => {
      if (success.idToken.claims.acr === b2cPolicies.names.resetPassword) {
        window.alert('Password has been reset successfully. \nPlease sign-in with your new password');
        return this.authService.logout();
      }
      this.checkAccount();
    });

    loginFailureSubscription = this.broadcastSerivce.subscribe('msal:loginFailure', (error) => {
      console.log('login failed');
      console.log(error);

      if (error.errorMessage) {
        if (error.errorMessage.indexOf('AADB2C90118') > -1) {
          if (isIE) {
            this.authService.loginRedirect(b2cPolicies.authorities.resetPassword);
          } else {
            this.authService.loginPopup(b2cPolicies.authorities.resetPassword);
          }
        }
      }
    });

    acquireTokenSuccessSubscription = this.broadcastSerivce.subscribe('msal:acquireTokenSuccess', (payload) => {
      // console.log('access token acquired at: ' + new Date().toString());
    });

    acquireTokenFailureSubscription = this.broadcastSerivce.subscribe('msal:acquireTokenFailure', (payload) => {
      console.log('access token acquisition fails');
    });

    this.authService.handleRedirectCallback((authError, response) => {
      if (authError) {
        console.error('Redirect Error: ', authError.errorMessage);
        return;
      }
    });

    this.authService.setLogger(new Logger((logLevel, message, piiEnabled) => {
      console.log('MSAL Logging: ', message);
    }, {
      correlationId: CryptoUtils.createNewGuid(),
      piiLoggingEnabled: false,
      level: LogLevel.Warning
    }));

    this.subscriptions.push(loginSuccessSubscription);
    this.subscriptions.push(loginFailureSubscription);
    this.subscriptions.push(acquireTokenSuccessSubscription);
    this.subscriptions.push(acquireTokenFailureSubscription);
    this.subscriptions.push(loaderSubscription);
    this.subscriptions.push(routerSubscription);
    this.checkAccount();
  }

  checkAccount(): void {
    this.isLoggedIn$.next(!!this.authService.getAccount());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.profile.clear();
  }

  login(): void {
    this.authService.loginPopup();
  }
}
