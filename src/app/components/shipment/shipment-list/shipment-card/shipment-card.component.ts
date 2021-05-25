import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ImportTrackingResultModel } from 'src/app/shared/models/import-tracking-result.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatMenu } from '@angular/material/menu';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-shipment-card',
    templateUrl: `./shipment-card.component.html`,
    styles: [``]
})
export class ShipmentCardComponent implements OnInit, AfterViewInit {
  @Input() data$: BehaviorSubject<ImportTrackingResultModel>;
  @Output() view: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  sort: MatSort = new MatSort();
  sortColumns: { [key: string]: any } = {};

  constructor(private tran: TranslateService) {
    tran.onLangChange.subscribe((e) => this.onLangChanged());
    this.onLangChanged();
  }

  onLangChanged(): void {
    this.tran.get([ 'systemRef', 'indentNumber', 'bu', 'department',
    'invoiceNo', 'shipper', 'consigneeName', 'origin', 'destination',
    'shippingMode', 'mawb', 'hawb', 'flightVessel', 'grossWeight',
    'chargeWeight', 'numberPackage', 'recdDate', 'status', 'cargoPickUpDate',
    'cleranceDate', 'departureDate', 'arrivalDate', 'deliveryDate']).subscribe(t => {
      this.sortColumns['systemRef'      ] = t['systemRef'];
      this.sortColumns['poNo'           ] = t['indentNumber'];
      this.sortColumns['buNumber'       ] = t['bu'];
      this.sortColumns['department'     ] = t['department'];
      this.sortColumns['invoiceNo'      ] = t['invoiceNo'];
      this.sortColumns['shipperName'    ] = t['shipper'];
      this.sortColumns['consigneeName'  ] = t['consigneeName'];
      this.sortColumns['exCountry'      ] = t['origin'];
      this.sortColumns['destOrig'       ] = t['destination'];
      this.sortColumns['tranType'       ] = t['shippingMode'];
      this.sortColumns['mawb'           ] = t['mawb'];
      this.sortColumns['hawb'           ] = t['hawb'];
      this.sortColumns['flightNumber'   ] = t['flightVessel'];
      this.sortColumns['grossWeight'    ] = t['grossWeight'];
      this.sortColumns['chargeWeight'   ] = t['chargeWeight'];
      this.sortColumns['numberPackage'  ] = t['numberPackage'];
      this.sortColumns['receivedDate'   ] = t['recdDate'];
      this.sortColumns['status'         ] = t['status'];
      this.sortColumns['collectionDate' ] = t['cargoPickUpDate'];
      this.sortColumns['declarationDate'] = t['cleranceDate'];
      this.sortColumns['etd'            ] = t['departureDate'];
      this.sortColumns['eta'            ] = t['arrivalDate'];
      this.sortColumns['deliveredDate'  ] = t['deliveryDate'];
  });
  }

  ngOnInit(): void {
    // this.menu.panelClass = 'my-panel';
    // Object.keys(this.sortColumns).forEach(x => console.log(this.sortColumns[x]));
  }

  ngAfterViewInit(): void {
  }

  detail(id): void {
    this.view.emit(id);
  }

  get columnKeys(): string[] {
    return Object.keys(this.sortColumns);
  }

  get iconDirection(): string {
    return this.data$.value.dir === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  get order(): string {
    if (this.data$.value.order) {
      return this.sortColumns[this.data$.value.order];
    }
  }

  sortChange(key: string): void {
    if (key !== this.sort.active) {
      this.paginator.pageIndex = 0;
      this.sort.active = key;
      this.sort.direction = 'asc';
    } else {
      this.sort.direction = this.sort.direction === 'desc' ? 'asc' : 'desc';
      this.sort.active = key;
      this.paginator.pageIndex = 0;
    }
    this.sort.sortChange.emit();
  }
}
