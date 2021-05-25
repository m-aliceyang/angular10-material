import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpServiceBase } from './http-service-base';
import { LoaderService } from './loader-service';
import { CompanyModel } from './models/company.model';
import { ImportTrackingDetailModel } from './models/import-tracking-detail.model';
import { ImportTrackingPostPutModel } from './models/import-tracking-post-put.model';
import { ImportTrackingResultModel } from './models/import-tracking-result.model';
import { KeyValuePairModel } from './models/key-value-pair.model';
import { ShipmentSearchModel } from './models/shipment-search.model';

@Injectable({
  providedIn: 'root'
})
export class ShippmentServices extends HttpServiceBase {
  constructor(httpClient: HttpClient,
              matBar: MatSnackBar,
              loader: LoaderService) {
  super(matBar, httpClient, loader);
  }

  search(model: any): Observable<ImportTrackingResultModel> {
    const url = `${location.origin}/api/import-trackings`;
    return this.get<ImportTrackingResultModel>(url, model);
  }

  export(model: any): Observable<any> {
    const url = `${location.origin}/api/import-trackings/export`;
    return this.download(url, model);
  }

  getStatus(): Observable<KeyValuePairModel[]> {
    const url = `${location.origin}/api/references/status`;
    return this.get<KeyValuePairModel[]>(url);
  }

  getDestinations(): Observable<KeyValuePairModel[]> {
    const url = `${location.origin}/api/references/destinations`;
    return this.get<KeyValuePairModel[]>(url);
  }

  getConsignees(): Observable<KeyValuePairModel[]> {
    const url = `${location.origin}/api/references/consignees`;
    return this.get<KeyValuePairModel[]>(url);
  }

  getTranTypes(): Observable<KeyValuePairModel[]> {
    const url = `${location.origin}/api/references/trantypes`;
    return this.get<KeyValuePairModel[]>(url);
  }

  getById(id: string): Observable<ImportTrackingDetailModel> {
    const url = `${location.origin}/api/import-trackings/${id}`;
    return this.get<ImportTrackingDetailModel>(url);
  }

  getCompanies(): Observable<CompanyModel[]> {
    const url = `${location.origin}/api/references/companies`;
    return this.get<CompanyModel[]>(url);
  }

  create(model: ImportTrackingPostPutModel): Observable<ImportTrackingDetailModel> {
    const url = `${location.origin}/api/import-trackings`;
    return this.post<ImportTrackingDetailModel>(url, model);
  }

  update(id: string, model: ImportTrackingPostPutModel): Observable<boolean> {
    const url = `${location.origin}/api/import-trackings/${id}`;
    return this.put<boolean>(url, model)
      .pipe(
        map(x => true),
        catchError(e => of(false))
      );
  }
}
