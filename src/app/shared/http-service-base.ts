import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { LoaderService } from './loader-service';

export abstract class HttpServiceBase {
  constructor(private bar: MatSnackBar, private http: HttpClient, private loader: LoaderService) {
  }

  httpStatusString: {[key: number]: string} = {
    400 : 'Bad Request',
    401 : 'Unauthorized',
    402 : 'Payment Required',
    403 : 'Forbidden',
    404 : 'Not Found',
    405 : 'Method Not Allowed',
    406 : 'Not Acceptable',
    407 : 'Proxy Authentication Required',
    408 : 'Request Timeout',
    409 : 'Conflict',
    410 : 'Gone',
    411 : 'Length Required',
    412 : 'Precondition Failed',
    413 : 'Request Entity Too Large',
    414 : 'Request-URI Too Long',
    415 : 'Unsupported Media Type',
    416 : 'Requested Range Not Satisfiable',
    417 : 'Expectation Failed',
    418 : 'I\'m a teapot',
    419 : 'Insufficient Space on Resource',
    420 : 'Method Failure',
    422 : 'Unprocessable Entity',
    423 : 'Locked',
    424 : 'Failed Dependency',
    428 : 'Precondition Required',
    429 : 'Too Many Requests',
    431 : 'Request Header Fields Too Large',
    451 : 'Unavailable For Legal Reasons',
    500 : 'Internal Server Error',
    501 : 'Not Implemented',
    502 : 'Bad Gateway',
    503 : 'Service Unavailable',
    504 : 'Gateway Timeout',
    505 : 'HTTP Version Not Supported',
    507 : 'Insufficient Storage',
    511 : 'Network Authentication Required'
  };

  errorHandler(error: HttpErrorResponse): Observable<never> {

    if (error?.error?.Message && error.error.Message.length > 0) {
      this.bar.open(error.error.Message, 'close', { panelClass: ['app-mat-snack-accent']});
      this.loader.display(false);
      return throwError(`An Error occured: ${error.error.Message}`);
    } else if (error.status) {
      console.log(error);
      this.bar.open(`error occur, response ${error.status}[${this.httpStatusString[error.status]}]`, 'close', {panelClass: ['app-mat-snack-accent']});
      this.loader.display(false);
      return throwError(`An Error occured: ${error.status}`);
    } else {
      console.log(error);
      return of();
    }
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

  download(url: string, param?: any): Observable<any> {
    return this.http.get(url, {
      params: param ? new HttpParams({ fromObject: param}) : null,
      responseType: 'blob'
    });
  }
}
