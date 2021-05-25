import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { MsalService } from '../msal';
import { CompanyModel } from './models/company.model';
import { UserProfileModel } from './models/user-profile.model';
import { BroadcastService, MsalService } from '@azure/msal-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class ProfileService {
  IDENTITY_KEY = 'identity';

  constructor(private http: HttpClient,
              private authService: MsalService,
              private broadcastSerivce: BroadcastService)
  {
    broadcastSerivce.subscribe('msal:loginSuccess', payload => {
      console.log('login success from service');
      this.loadProfile();
    });
  }

  public identity$: BehaviorSubject<UserProfileModel> = new BehaviorSubject<UserProfileModel>(null);

  loadProfile(): void {
    this.loadProfile$().subscribe();
  }

  loadProfile$(): Observable<UserProfileModel> {
    const url = `${location.origin}/api/users/my-profile`;
    const ob = this.http.get(url).pipe(
      tap((res: UserProfileModel) => {
        sessionStorage.removeItem('isLogout');
        this.identity$.next(res);
      })
    );
    return ob;
  }

  clear(): void {
    // sessionStorage.removeItem(this.IDENTITY_KEY);
    // localStorage.removeItem(this.IDENTITY_KEY);
  }

  logout(): void {
    sessionStorage.setItem('isLogout', 'y');
    this.authService.logout();
  }

  get isLogout(): boolean {
    const flag = sessionStorage.getItem('isLogout');
    return flag && flag === 'y' ? true : false;
  }

  get isLoggedIn(): boolean {
    return !!this.authService.getAccount();
  }

  get identity(): UserProfileModel {
    // const j = sessionStorage.getItem(this.IDENTITY_KEY);
    // return j && j.length > 0 ? JSON.parse(j) : null;
    return this.identity$.value;
  }

  get isAdmin(): boolean {
    return this.identity && this.identity.roles.indexOf('Admin') >= 0;
  }

  get isSuper(): boolean {
    return this.identity && (this.identity.roles.indexOf('Admin') >= 0 || this.identity.roles.indexOf('Super') >= 0);
  }

  get companies(): CompanyModel[]{
    return this.identity && this.identity.companies ? this.identity.companies : [];
  }
}
