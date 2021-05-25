import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject } from 'rxjs';
import { ConsigneeListResult } from 'src/app/shared/models/consignee-list-result.model';

@Component({
  selector: 'app-consignee-list-card',
  template: `
  <div class="data-card" fxFlexFill fxLayout="row wrap" fxLayoutAlign="space-between start" [ngStyle]="{'margin-top': '1rem'}">
    <div fxFlex="100">
      <button mat-button [matMenuTriggerFor]="menu">{{'sortBy' | translate}}: [{{order | translate}} <mat-icon [ngStyle]="{'font-size': '1.2rem'}">{{iconDirection}}</mat-icon>]</button>
      <mat-menu #menu="matMenu">
        <button mat-menu-item (click)="sortChange('code')">{{'code' | translate}}</button>
        <button mat-menu-item (click)="sortChange('name')">{{'name' | translate}}</button>
        <button mat-menu-item (click)="sortChange('companyName')">{{'company' | translate}}</button>
        <button mat-menu-item (click)="sortChange('createdByUser')">{{'createdBy' | translate}}</button>
        <button mat-menu-item (click)="sortChange('createdDate')">{{'createdDate' | translate}}</button>
        <button mat-menu-item (click)="sortChange('lastUpdatedByUser')">{{'lastUpdatedBy' | translate}}</button>
        <button mat-menu-item (click)="sortChange('lastUpdatedDate')">{{'lastUpdatedDate' | translate}}</button>
      </mat-menu>
    </div>
    <mat-card class="example-card mat-elevation-z custom-card no-padding"
      fxFlex="31" fxFlex.lt-md="48" fxFlex.lt-sm="100"
      *ngFor="let item of (data$ | async).data"
      [ngStyle]="{'margin-bottom':'1rem'}"
    >
        <mat-card-header>
            <mat-card-title>{{item.code}}</mat-card-title>
            <mat-card-subtitle>{{item.name}}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <table>
            <tr><th>{{'companyName' | translate}}:</th><td>{{item.companyName}}</td></tr>
            <tr><th>{{'createdBy' | translate}}:</th><td>{{item.createdByUser}}</td></tr>
            <tr><th>{{'createdDate' | translate}}:</th><td>{{item.createdDate | date:'short'}}</td></tr>
            <tr><th>{{'lastUpdatedBy' | translate}}:</th><td>{{item.lastUpdatedByUser}}</td></tr>
            <tr><th>{{'lastUpdatedDate' | translate}}:</th><td>{{item.lastUpdatedDate | date:'short'}}</td></tr>
          </table>
        </mat-card-content>
        <mat-card-actions fxLayoutAlign="end stretch">
            <button mat-button color="primary" (click)="detail(item.id)">{{'update' | translate}}</button>
        </mat-card-actions>
    </mat-card>
  </div>
  <mat-paginator [length]="(data$ | async).records"
                 [pageSizeOptions]="[10, 20, 50]"
                 [pageIndex]="(data$ | async).page"
                 [pageSize]="(data$ | async).pageSize" showFirstLastButtons></mat-paginator>
  `
})
export class ConsigneeListCardComponent implements OnInit {
  @Input() data$: BehaviorSubject<ConsigneeListResult>;
  @Output() view = new EventEmitter<string>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  sort: MatSort = new MatSort();

  ngOnInit(): void {

  }

  get iconDirection(): string {
    return this.data$.value.dir === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  get order(): string {
    switch (this.data$?.value?.order) {
      case 'code': return 'code';
      case 'name': return 'name';
      case 'companyName': return 'company';
      case 'createdByUser': return 'createdUser';
      case 'createdDate': return 'createdDate';
      case 'lastUpdatedByUser': return 'lastUpdatedUser';
      case 'lastUpdatedDate': return 'lastUpdatedDate';
      default: return '';
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

  detail(id: string): void {
    this.view.emit(id);
  }
}
