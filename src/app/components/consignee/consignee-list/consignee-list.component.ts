import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription, merge } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ChooseTypeComponent } from 'src/app/shared/choose-type.component';
import { ConsigneeServices } from 'src/app/shared/consignee-services';
import { LoaderService } from 'src/app/shared/loader-service';
import { ConsigneeListResult } from 'src/app/shared/models/consignee-list-result.model';
import { ProfileService } from 'src/app/shared/profile.service';
import { KeywordSearchModel } from '../../../shared/models/keyword-search.model';
import { ConsigneeListCardComponent } from './consignee-card/consignee-card.component';
import { ConsigneeListTableComponent } from './consignee-table/consignee-table.component';

@Component({
  selector: 'app-consignee-list',
  templateUrl: './consignee-list.component.html',
  styleUrls: ['./consignee-list.component.scss']
})
export class ConsigneeListComponent implements OnInit, OnDestroy, AfterViewInit {
  type: 'card' | 'table' = 'table';
  keyword: string;
  dataSource$: BehaviorSubject<ConsigneeListResult> = new BehaviorSubject<ConsigneeListResult>(
    {
      page: 0,
      pageSize: 10,
      order: 'name',
      dir: 'acs',
      records: 0,
      pages: 0,
      data: []
    });
  isSwitched = true;
  @ViewChild(ConsigneeListTableComponent) tableView: ConsigneeListTableComponent;
  @ViewChild(ConsigneeListCardComponent) cardView: ConsigneeListCardComponent;
  @ViewChild(ChooseTypeComponent) chooseType: ChooseTypeComponent;
  subscription$: Subscription;

  constructor(private router: Router,
              private service: ConsigneeServices,
              private route: ActivatedRoute,
              private loader: LoaderService,
              public profile: ProfileService) { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
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
        dir: this.tableView.sort.direction,
        page: this.tableView.paginator.pageIndex || 0,
        pageSize: this.tableView.paginator.pageSize || 10,
        order: this.tableView.sort.active || this.dataSource$.value.order,
        keyword: this.keyword
      };
      this.onSearch(model);
    });
  }

  cardSubscription(): void {
    this.cardView.paginator.pageIndex = this.dataSource$.value.page;
    this.subscription$ = merge(this.cardView.paginator.page, this.cardView.sort.sortChange)
      .subscribe((x: KeywordSearchModel) => {
        this.isSwitched = false;
        const model = {
          dir: this.cardView.sort.direction,
          page: this.cardView.paginator.pageIndex || 0,
          pageSize: this.cardView.paginator.pageSize || 10,
          order: this.cardView.sort.active || this.dataSource$.value.order,
          keyword: this.keyword
        };
        this.onSearch(model);
    });
  }

  ngAfterViewInit(): void {
    this.switchView('table');
    this.route.queryParams.pipe(delay(200)).subscribe((x: KeywordSearchModel) => {
      if (!x || !x.page || !x.pageSize) { this.loader.display(false); return; }
      this.chooseType.changeType(x.view || 'table');
      this.isSwitched = false;
      const model: ConsigneeListResult = {
        ...x, data: []
      };
      this.keyword = x.keyword;
      this.dataSource$.next(model);
      this.onSearch(x);
    });
  }

  onSearch($event?: KeywordSearchModel): void {
    if (!this.keyword || this.keyword.length === 0 || this.isSwitched) {
      return;
    }
    const model: KeywordSearchModel = $event ? {...$event} : {...this.mapModel(), page: 0};
    this.loader.display(true);
    this.service.searchConsigneeByKeyword(model).subscribe(e => {
      this.dataSource$.next(e);
      this.loader.display(false);
    });
  }

  mapModel(): KeywordSearchModel {
    const result: KeywordSearchModel = {
      page: this.dataSource$.value ? this.dataSource$.value.page : 0,
      pageSize: this.dataSource$.value ? this.dataSource$.value.pageSize : 10,
      order: this.dataSource$.value ? this.dataSource$.value.order : 'name',
      dir: this.dataSource$.value ? this.dataSource$.value.dir : 'acs',
      keyword: this.keyword,
      view: this.type
    };
    return result;
  }

  create(): void {
    this.router.navigate(['consignee', 'post']);
  }

  detail(id): void {
    this.router.navigate(['consignee', 'edit', id], {queryParams: this.mapModel()});
  }

  clearKeyword(): void {
    this.keyword = '';
  }
}
