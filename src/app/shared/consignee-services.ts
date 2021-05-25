import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpServiceBase } from './http-service-base';
import { LoaderService } from './loader-service';
import { CompanyModel } from './models/company.model';
import { ConsigneeListResult } from './models/consignee-list-result.model';
import { ConsigneePostModel } from './models/consignee-post.model';
import { ConsigneeModel } from './models/consignee.model';
import { KeywordSearchModel } from './models/keyword-search.model';
import { UserServices } from './user-services';

@Injectable({
  providedIn: 'root'
})
export class ConsigneeServices extends HttpServiceBase {
  constructor(httpClient: HttpClient,
              matBar: MatSnackBar,
              private userServices: UserServices,
              loader: LoaderService) {
    super(matBar, httpClient, loader);
  }

  searchConsigneeByKeyword(model: KeywordSearchModel): Observable<ConsigneeListResult> {
    const url = `${location.origin}/api/consignees`;
    return this.get<ConsigneeListResult>(url, model);
  }

  getConsigneeById(id: string): Observable<ConsigneeModel> {
    const url = `${location.origin}/api/consignees/${id}`;
    return this.get<ConsigneeModel>(url);
  }

  createConsignee(model: ConsigneePostModel): Observable<any> {
    const url = `${location.origin}/api/consignees`;
    return this.post<any>(url, model);
  }

  updateConsignee(id: string, model: ConsigneePostModel): Observable<any> {
    const url = `${location.origin}/api/consignees/${id}`;
    return this.put<boolean>(url, model).pipe(
      map(x => of(true))
    );
  }

  getCompanies(): Observable<CompanyModel[]> {
    return this.userServices.getCompanies();
  }
}
