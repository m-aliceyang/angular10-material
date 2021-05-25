import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient, public bar: MatSnackBar) { }
  getUserList(query: any): Observable<any> {
      const url = 'userlist';
      return this.http.get(url, {
          params: new HttpParams({ fromObject: query })
      }).pipe(
          retry(3),
          catchError(e => this.errorHandler(e))
      );
  }

  get<T>(url: string, param?: any): Observable<T> {
    return this.http.get<T>(url, {
      params: param ? new HttpParams({ fromObject: param}) : null
    }).pipe(
      retry(3),
      catchError(e => this.errorHandler(e))
    );
  }

  put<T>(url: string, param: any): Observable<T> {
    return this.http.put<T>(url, param).pipe(
      retry(3),
      catchError(e => this.errorHandler(e))
    );
  }

  post<T>(url: string, param: any): Observable<T> {
    return this.http.post<T>(url, param).pipe(
      retry(3),
      catchError(e => this.errorHandler(e))
    );
  }

  private errorHandler(error: HttpErrorResponse): Observable<never> {
    if (error.error.Message && error.error.Message.length > 0) {
      this.bar.open(error.error.Message, 'close', { panelClass: ['app-mat-snack-accent']});
      return throwError(`An Error occured: ${error.error.Message}`);
    } else {
      this.bar.open(error.message, 'close', { panelClass: ['app-mat-snack-accent']});
      return throwError(`An Error occured: ${error.message}`);
    }
  }
}
