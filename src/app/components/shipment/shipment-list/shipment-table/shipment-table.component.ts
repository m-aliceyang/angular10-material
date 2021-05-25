import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ImportTrackingResultModel } from 'src/app/shared/models/import-tracking-result.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
    selector: 'app-shipment-table',
    templateUrl: `./shipment-table.component.html`,
    styles: [``]
})
export class ShipmentTableComponent implements OnInit {
  constructor() { }

  displayColumns: string[] = [
    'actions',
    'systemRef',
    'poNo',
    'buNumber',
    'department',
    'invoiceNo',
    'shipperName',
    'consigneeName',
    'exCountry',
    'destOrig',
    'tranType',
    'mawb',
    'hawb',
    'flightNumber',
    'grossWeight',
    'chargeWeight',
    'numberPackage',
    'receivedDate',
    'status',
    'collectionDate',
    'declarationDate',
    'etd',
    'eta',
    'deliveredDate',
  ];
  @Input() data$: BehaviorSubject<ImportTrackingResultModel>;
  @Output() view = new EventEmitter<string>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  detail(id): void {
    this.view.emit(id);
  }

  ngOnInit(): void {

  }
}
