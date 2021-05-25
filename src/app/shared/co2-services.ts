import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { HttpServiceBase } from './http-service-base';
import { Co2SearchModel } from './models/co2-search.model';
import { Co2Model } from './models/co2.model';
import { KeyValuePairModel } from './models/key-value-pair.model';
import { CompanyModel } from './models/company.model';
import { LoaderService } from './loader-service';

@Injectable({
  providedIn: 'root'
})
export class Co2Services extends HttpServiceBase {
  constructor(private httpClient: HttpClient,
              private matBar: MatSnackBar,
              loader: LoaderService) {
                super(matBar, httpClient, loader);
              }

  search(model: Co2SearchModel): Observable<Co2Model[]> {
    const url = `${location.origin}/api/co2`;
    return this.get<Co2Model[]>(url, model);
  }

  export(model: Co2SearchModel): Observable<any> {
    const url = `${location.origin}/api/co2/export`;
    return this.download(url, model);
  }

  getTranTypes(): Observable<KeyValuePairModel[]> {
    const url = `${location.origin}/api/co2/tran-types`;
    return this.get<KeyValuePairModel[]>(url);
  }

  getDestinations(): Observable<KeyValuePairModel[]> {
    const url = `${location.origin}/api/co2/destinations`;
    return this.get<KeyValuePairModel[]>(url);
  }

  getOrigins(): Observable<KeyValuePairModel[]> {
    const url = `${location.origin}/api/co2/origins`;
    return this.get<KeyValuePairModel[]>(url);
  }

  getCompanies(): Observable<CompanyModel[]> {
    const url = `${location.origin}/api/references/companies`;
    return this.get<CompanyModel[]>(url);
  }
}
