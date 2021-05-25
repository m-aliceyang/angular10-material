import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ProfileService } from './profile.service';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private profile: ProfileService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean|UrlTree>|Promise<boolean|UrlTree>|boolean|UrlTree {
    let msg: string;
    const role = route.data.role as string;
    if (!this.profile.identity) {
      const subject = this.profile.loadProfile$().pipe(
        map((res: any) => {
          return this.roleValid(role);
        }),
        catchError(() => {
          msg = 'fail to get profile';
          this.router.navigate(['home'], {queryParams: {error: msg}});
          return of(false);
        })
      );
      return subject;
    } else {
      return this.roleValid(role);
    }
  }

  roleValid(role: string): boolean {
    let roleValid = false;
    if (!this.profile.identity) {
      const msg = 'You do have profile';
      this.router.navigate(['home'], {queryParams: {error: msg}});
      return false;
    }
    switch (role) {
      case 'Admin':
        roleValid = this.profile.isAdmin;
        break;
      case 'Super':
        roleValid = this.profile.isSuper;
        break;
    }
    if (!roleValid) {
      const msg = 'You do not have permission to visit this resource';
      this.router.navigate(['home'], {queryParams: {error: msg}});
      return false;
    }
    return roleValid;
  }
}
