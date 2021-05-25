import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject } from 'rxjs';
import { UserProfileListResult } from 'src/app/shared/models/user-profile-list.result';

@Component({
    selector: 'app-user-card',
    template: `
<div class="data-card" fxFlexFill fxLayout="row wrap" fxLayout.lt-sm="column" fxLayoutAlign="start center" [ngStyle]="{'margin-top': '1rem'}" fxLayoutGap="20px">
  <div fxFlex="100">
    <button mat-button [matMenuTriggerFor]="menu">Sort By: [{{order}} <mat-icon [ngStyle]="{'font-size': '1.2rem'}">{{iconDirection}}</mat-icon>]</button>
    <mat-menu #menu="matMenu">
      <button mat-menu-item (click)="sortChange('name')">{{'name' | translate}}</button>
      <button mat-menu-item (click)="sortChange('email')">{{'email' | translate}}</button>
      <button mat-menu-item (click)="sortChange('createdByUser')">{{'createdBy' | translate}}</button>
      <button mat-menu-item (click)="sortChange('createdDate')">{{'createdDate' | translate}}</button>
      <button mat-menu-item (click)="sortChange('lastUpdatedByUser')">{{'lastUpdatedBy' | translate}}</button>
      <button mat-menu-item (click)="sortChange('lastUpdatedDate')">{{'lastUpdatedDate' | translate}}</button>
    </mat-menu>
  </div>
  <mat-card class="example-card mat-elevation-z custom-card no-padding mb-20"
    *ngFor="let row of (data$ | async).data"
    fxFlex="31" fxFlex.lt-md="47" fxFlex.lt-sm="100"
  >
      <mat-card-header>
          <mat-card-title>{{row.name}}</mat-card-title>
          <mat-card-subtitle>{{row.email}}</mat-card-subtitle>
      </mat-card-header>
      <mat-card-content>
        <table class="detail-table">
          <tr><th>{{'branch' | translate}}:</th><td>{{row.branch}}</td></tr>
          <tr><th>{{'department' | translate}}:</th><td>{{row.department}}</td></tr>
          <tr><th>{{'roles' | translate}}:</th><td>{{row.roles}}</td></tr>
          <tr><th>{{'companies' | translate}}:</th><td>{{row.companies}}</td></tr>
          <tr><th>{{'activation' | translate}}:</th><td>{{row.isActive}}</td></tr>
          <tr><th>{{'createdBy' | translate}}:</th><td>{{row.createdByUser}}</td></tr>
          <tr><th>{{'createdDate' | translate}}:</th><td>{{row.createdDate | date}}</td></tr>
          <tr><th>{{'lastUpdatedBy' | translate}}:</th><td>{{row.lastUpdatedByUser}}</td></tr>
          <tr><th>{{'lastUpdatedDate' | translate}}:</th><td>{{row.lastUpdatedDate | date}}</td></tr>
        </table>
      </mat-card-content>
      <mat-card-actions fxLayoutAlign="end stretch">
          <button mat-button color="primary" (click)="update(row.id)">{{'update' | translate}}</button>
      </mat-card-actions>
  </mat-card>
</div>
<mat-paginator [length]="(data$ | async).records"
                   [pageSize]="(data$ | async).pageSize"
                   [pageIndex]="(data$ | async).page"
                   [pageSizeOptions]="[10, 20, 50]" showFirstLastButtons></mat-paginator>
    `,
    styles: [``]
})
export class UserCardComponent implements OnInit {
  @Input() data$: BehaviorSubject<UserProfileListResult>;
  @Output() view = new EventEmitter<string>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  sort: MatSort = new MatSort();

  constructor() { }

  ngOnInit(): void {

  }

  get iconDirection(): string {
    return this.data$.value.dir === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  get order(): string {
    switch (this.data$?.value?.order) {
      case 'name': return 'Name';
      case 'email': return 'Email';
      case 'createdByUser': return 'Created User';
      case 'createdDate': return 'Created Date';
      case 'lastUpdatedByUser': return 'Last Updated User';
      case 'lastUpdatedDate': return 'Last Updated Date';
      default: return '';
    }
  }

  update(id): void {
      // this.router.navigate(['user', 'edit', id]);
      this.view.emit(id);
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
