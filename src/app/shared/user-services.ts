import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CompanyModel } from './models/company.model';
import { KeywordSearchModel } from './models/keyword-search.model';
import { UserProfileListResult } from './models/user-profile-list.result';
import { UserProfileModel } from './models/user-profile.model';
import {catchError, map} from 'rxjs/operators';
import { UserProfilePostPutModel } from './models/user-profile-post-put.model';
import { HttpClient } from '@angular/common/http';
import { HttpServiceBase } from './http-service-base';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from './loader-service';

@Injectable({
  providedIn: 'root'
})
export class UserServices extends HttpServiceBase {
  constructor(httpClient: HttpClient, matBar: MatSnackBar, loader: LoaderService) {
    super(matBar, httpClient, loader);
  }

  searchUserByKeyWord(model: KeywordSearchModel): Observable<UserProfileListResult>{
    const url = `${location.origin}/api/users`;
    return this.get<UserProfileListResult>(url, model);
  }
  getUserById(id: string): Observable<UserProfileModel> {
    const url = `${location.origin}/api/users/${id}`;
    return this.get<UserProfileModel>(url);
  }
  getCompanies(): Observable<CompanyModel[]> {
    const url = `${location.origin}/api/users/companies`;
    return this.get<CompanyModel[]>(url);
  }
  resetPassword(id: string, newPassword: string,
                forceChange: boolean, sendEmail: boolean)
                : Observable<boolean> {
    const url = `${location.origin}/api/users/${id}/reset`;
    return this.put<any>(url, {password: newPassword, forceChange, sendEmail})
      .pipe(
        map((x) => true),
        catchError(error => of(false))
      );
  }
  createUser(model: UserProfilePostPutModel): Observable<any> {
    const url = `${location.origin}/api/users`;
    return this.post<any>(url, model);
  }
  updateUser(id: string, model: UserProfilePostPutModel): Observable<any> {
    const url = `${location.origin}/api/users/${id}`;
    return this.put<any>(url, model);
  }
  suspendUser(id: string): Observable<boolean> {
    const url = `${location.origin}/api/users/${id}/suspend`;
    return this.put<any>(url, null).pipe(
      map(r => true),
      catchError(e => of(false))
    );
  }
  activateUser(id: string): Observable<boolean> {
    const url = `${location.origin}/api/users/${id}/activate`;
    return this.put<any>(url, null).pipe(
      map(r => true),
      catchError(e => of(false))
    );
  }
  getMyProfile(): Observable<any> {
    return this.get<any>(`${location.origin}/api/users/my-profile`);
  }
}
