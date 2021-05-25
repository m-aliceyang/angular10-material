import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject } from 'rxjs';
import { ConsigneeListResult } from 'src/app/shared/models/consignee-list-result.model';

@Component({
  selector: 'app-consignee-list-table',
  template: `
  <div class="data-table" fxFlex="100" fxLayout="column">
        <table mat-table matSort [dataSource]="(data$ | async).data" class="mat-elevation-z8 table-striped full-width" fxFlex="100%">
            <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>
                    {{'actions' | translate}}
                </th>
                <td mat-cell *matCellDef="let row">
                    <button class="btn-detail" mat-button (click)="detail(row.id)">{{'detail' | translate}}</button>
                </td>
            </ng-container>
            <ng-container matColumnDef="code">
                <th mat-header-cell *matHeaderCellDef mat-sort-header> {{'consigneeCode' | translate}} </th>
                <td mat-cell *matCellDef="let element"> {{element.code}} </td>
            </ng-container>
            <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header> {{'consigneeName' | translate}}</th>
                <td mat-cell *matCellDef="let element"> {{element.name}} </td>
            </ng-container>
            <ng-container matColumnDef="companyName">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> {{'company' | translate}}</th>
              <td mat-cell *matCellDef="let element"> {{element.companyName}} </td>
            </ng-container>
            <ng-container matColumnDef="createdByUser">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> {{'createdBy' | translate}}</th>
              <td mat-cell *matCellDef="let element"> {{element.createdByUser}} </td>
            </ng-container>
            <ng-container matColumnDef="createdDate">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> {{'createdDate' | translate}}</th>
              <td mat-cell *matCellDef="let element"> {{element.createdDate | date:'short' }} </td>
            </ng-container>
            <ng-container matColumnDef="lastUpdatedByUser">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> {{'lastUpdatedBy' | translate}}</th>
              <td mat-cell *matCellDef="let element"> {{element.lastUpdatedByUser}} </td>
            </ng-container>
            <ng-container matColumnDef="lastUpdatedDate">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> {{'lastUpdatedDate' | translate}}</th>
              <td mat-cell *matCellDef="let element"> {{element.lastUpdatedDate | date:'short'}} </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
        <mat-paginator [length]="(data$ | async).records"
                       [pageSizeOptions]="[10, 20, 50]"
                       [pageIndex]="(data$ | async).page"
                       [pageSize]="(data$ | async).pageSize" showFirstLastButtons></mat-paginator>
    </div>
  `
})
export class ConsigneeListTableComponent implements OnInit {
  @Input() data$: BehaviorSubject<ConsigneeListResult>;
  @Output() view = new EventEmitter<string>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['actions', 'code', 'name', 'companyName', 'createdByUser', 'createdDate', 'lastUpdatedByUser', 'lastUpdatedDate'];

  ngOnInit(): void {

  }

  detail(id: string): void {
    this.view.emit(id);
  }
}
