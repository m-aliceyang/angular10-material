import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import {Injectable} from '@angular/core';
import { MsalInterceptor } from '@azure/msal-angular';
import { Observable } from 'rxjs';

@Injectable(
  {providedIn: 'root'}
)
export class AppInterceptor extends MsalInterceptor implements HttpInterceptor {
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const indicator = `${location.origin}/api`;
    if (req.url.indexOf(indicator) >= 0) {
      return super.intercept(req, next);
    } else {
      const request = req.clone();
      return next.handle(request);
    }
  }
}
