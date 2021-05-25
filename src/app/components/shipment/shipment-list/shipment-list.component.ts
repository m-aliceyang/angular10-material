import { AfterContentInit, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShipmentSearchModel } from './/../../../shared/models/shipment-search.model';
import { ImportTrackingResultModel } from '../../../shared/models/import-tracking-result.model';
import { BehaviorSubject, Subscription, merge, forkJoin, of } from 'rxjs';
import { catchError, delay, tap } from 'rxjs/operators';
import { ShippmentServices } from 'src/app/shared/shippment-services';
import { DestinationModel } from 'src/app/shared/models/destination.model';
import { CompanyModel } from 'src/app/shared/models/company.model';
import { ImportTrackingStatusModel } from 'src/app/shared/models/import-tacking-status.model';
import * as _ from 'moment';
import { TranTypeModel } from 'src/app/shared/models/tran-type.model';
import { LoaderService } from 'src/app/shared/loader-service';
import { ShipmentTableComponent } from './shipment-table/shipment-table.component';
import { ShipmentCardComponent } from './shipment-card/shipment-card.component';
import { ChooseTypeComponent } from 'src/app/shared/choose-type.component';
import { ProfileService } from 'src/app/shared/profile.service';
import { KeyValuePairModel } from 'src/app/shared/models/key-value-pair.model';
import * as moment from 'moment';

@Component({
  selector: 'app-shipment-list',
  templateUrl: './shipment-list.component.html',
  styleUrls: ['./shipment-list.component.scss']
})
export class ShipmentListComponent implements OnInit, AfterViewInit {
  type: 'card' | 'table' = 'table';
  dataSource$: BehaviorSubject<ImportTrackingResultModel> =
    new BehaviorSubject<ImportTrackingResultModel>({
      page: 0, pageSize: 10, order: 'department', dir: 'asc', records: 0, pages: 0, data: []
    });

  model: ShipmentSearchModel = { page: 0, pageSize: 10, order: 'indentNumber', dir: 'asc' };
  destinations$: BehaviorSubject<DestinationModel[]> = new BehaviorSubject<DestinationModel[]>([]);
  companies$: BehaviorSubject<CompanyModel[]> = new BehaviorSubject<CompanyModel[]>([]);
  status$: BehaviorSubject<ImportTrackingStatusModel[]> = new BehaviorSubject<ImportTrackingStatusModel[]>([]);
  panelOpenState$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  tranType$: BehaviorSubject<TranTypeModel[]> = new BehaviorSubject<TranTypeModel[]>([]);

  isSwitched = true;
  @ViewChild(ShipmentTableComponent) tableView: ShipmentTableComponent;
  @ViewChild(ShipmentCardComponent) cardView: ShipmentCardComponent;
  @ViewChild(ChooseTypeComponent) chooseType: ChooseTypeComponent;
  subscription$: Subscription;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private service: ShippmentServices,
              private loader: LoaderService,
              public profile: ProfileService)
  {
  }

  ngOnInit(): void {
    this.reset();
    // this.route.queryParams.pipe(
    //   delay(200)
    // ).subscribe(p => {
    //   if (Object.keys(p).length === 0) { return; }
    //   this.model = {...p.key, ...p};
    //   this.onSearch();
    // });
    this.switchView('table');
  }

  ngAfterViewInit(): void {
    this.route.queryParams.pipe(delay(200)).subscribe((x: ShipmentSearchModel) => {
      if (!x || !x.page || !x.pageSize) { return; }
      this.chooseType.changeType(x.view || 'table');
      this.isSwitched = false;
      const model: ImportTrackingResultModel = {
        ...x, data: []
      };
      this.model = {...x};
      this.dataSource$.next(model);
      this.onSearch(model);
    });

    const destinationOb = this.service.getDestinations().pipe(tap(x => this.destinations$.next(x)));
    const statusOb = this.service.getStatus().pipe(tap(x => this.status$.next(x)));
    const companyOb = this.service.getCompanies().pipe(tap(x => this.companies$.next(x)));
    const tranTypeOb = this.service.getTranTypes().pipe(tap(x => this.tranType$.next(x)));
    forkJoin([destinationOb, statusOb, companyOb, tranTypeOb]).pipe(delay(200)).subscribe({
      next: () => this.loader.display(false),
      error: (err) => {
        console.log(err);
        this.loader.display(false);
      }
    });
  }

  switchView(type: 'card' | 'table'): void {
    this.isSwitched = true;
    this.type = type;
    setTimeout(() => {
      if (this.type === 'table') {
        this.tableSubscription();
      } else {
        this.cardSubscription();
      }}, 10);
  }

  tableSubscription(): void {
    this.tableView.paginator.pageIndex = this.dataSource$.value.page;
    this.subscription$ = merge(this.tableView.paginator.page, this.tableView.sort.sortChange).subscribe((x) => {
      this.isSwitched = false;
      const model = {
        ...this.mapModel(),
        dir: this.tableView.sort.direction,
        page: this.tableView.paginator.pageIndex || 0,
        pageSize: this.tableView.paginator.pageSize || 10,
        order: this.tableView.sort.active || this.dataSource$.value.order
      };
      this.onSearch(model);
    });
  }

  cardSubscription(): void {
    this.cardView.paginator.pageIndex = this.dataSource$.value.page;
    this.subscription$ = merge(this.cardView.paginator.page, this.cardView.sort.sortChange)
      .subscribe((x) => {
        this.isSwitched = false;
        const model = {
          ...this.mapModel(),
          dir: this.cardView.sort.direction,
          page: this.cardView.paginator.pageIndex || 0,
          pageSize: this.cardView.paginator.pageSize || 10,
          order: this.cardView.sort.active || this.dataSource$.value.order
        };
        this.onSearch(model);
    });
  }

  onSearch($event?: any): void {
    if (this.isSwitched) { return; }
    this.loader.display(true);
    const model = $event || this.mapModel();
    this.service.search(model).subscribe(x => {
      this.dataSource$.next(x);
      this.panelOpenState$.next(false);
      this.loader.display(false);
    });
  }

  panelOpened(): void {
    this.panelOpenState$.next(true);
  }

  mapModel(fromDetail?: boolean): any {
    const searchModel = {
      page: fromDetail ? this.dataSource$?.value?.page || 0 : 0,
      pageSize: this.dataSource$?.value?.pageSize || 10,
      order: this.dataSource$?.value?.order || 'indentNumber',
      dir: this.dataSource$?.value?.dir || 'acs',
      indentNumber: this.model.indentNumber || '',
      mawb: this.model.mawb || '',
      hawb: this.model.hawb || '',
      etdFrom: this.model.etdFrom ? moment(this.model.etdFrom).toISOString() : '',
      etdTo: this.model.etdTo ? moment(this.model.etdTo).toISOString() : '',
      deliveredFrom: this.model.deliveredFrom ? moment(this.model.deliveredFrom).toISOString() : '',
      deliveredTo: this.model.deliveredTo ? moment(this.model.deliveredTo).toISOString() : '',
      pickupDateFrom: this.model.pickupDateFrom ? moment(this.model.pickupDateFrom).toISOString() : '',
      pickupDateTo: this.model.pickupDateTo ? moment(this.model.pickupDateTo).toISOString() : '',
      shipper: this.model.shipper || '',
      invoice: this.model.invoice || '',
      destination: this.model.destination || '',
      status: this.model.status || '',
      companies: this.model.companies || [],
      tranTypes: this.model.tranType || [],
      consignee: this.model.consignee || '',
      department: this.model.department || '',
      view: this.type
    };
    return searchModel;
  }

  create(): void {
    this.router.navigate(['shipment', 'post']);
  }

  detail(id: string): void {
    this.router.navigate(['shipment', 'edit', id]);
  }

  reset(): void {
    this.model = {
      page: this.dataSource$?.value?.page || 1,
      pageSize: this.dataSource$?.value?.pageSize || 10,
      order: this.dataSource$?.value?.order || 'indentNumber',
      dir: this.dataSource$?.value?.dir || 'acs'
    };
  }

  export(): void {
    this.service.export(this.mapModel()).subscribe(x => {
      const filename = 'shipment-' + _(new Date()).format('YYYYMMDDHHmmss') + '.csv';
      const url = window.URL.createObjectURL(x);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
  }

  openDetail(id: string): void {
    this.router.navigate(['shipment', 'edit', id], {queryParams: this.mapModel(true)});
  }
}
