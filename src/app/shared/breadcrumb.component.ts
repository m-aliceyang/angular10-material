import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Breadcrumb } from './models/breadcrumb.model';

@Component({
  selector: 'app-breadcrumb',
  template: `
    <div class="top-nav">
        <nav aria-label="breadcrumb" fxFlex="30%" fxFlex.lt-md="100%">
            <ol class="breadcrumb">
                <li  *ngFor="let item of navs" class="breadcrumb-item" [ngClass]="{'active':item.isActive}"><a href="javascript:void(0)" (click)="go(item)">{{item.label}}</a></li>
            </ol>
        </nav>
    </div>
    `,
  styles: [``]
})
export class BreadcrumbComponent implements OnInit {
  @Input() navs: Breadcrumb[];
  constructor(private router: Router) { }

  ngOnInit(): void {

  }

  go(item: Breadcrumb): void {
    if (item.value === ['home']) {
      this.router.navigate(['home']);
    } else {
      if (!item.isActive) {
        this.router.navigate(item.value);
      }
    }
  }
}
